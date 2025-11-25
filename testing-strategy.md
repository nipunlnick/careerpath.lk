# Testing & Quality Assurance Strategy

## 1. Automated Testing Setup

```json
// package.json - Add testing dependencies
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "cypress": "^13.0.0",
    "vitest": "^1.0.0"
  },
  "scripts": {
    "test": "vitest",
    "test:e2e": "cypress run",
    "test:coverage": "vitest --coverage"
  }
}
```

## 2. Unit Tests Examples

```typescript
// __tests__/components/CareerQuiz.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CareerQuiz } from "../components/CareerQuiz";

describe("CareerQuiz Component", () => {
  test("renders quiz questions correctly", () => {
    render(<CareerQuiz />);
    expect(
      screen.getByText(/Find Your Perfect Career Path/i)
    ).toBeInTheDocument();
  });

  test("progresses through questions on answer selection", async () => {
    render(<CareerQuiz />);

    const firstOption = screen.getByText(/first option/i);
    fireEvent.click(firstOption);

    await waitFor(() => {
      expect(screen.getByText(/question 2/i)).toBeInTheDocument();
    });
  });

  test("displays results after completing all questions", async () => {
    // Mock API response
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          suggestions: [
            { career: "Software Engineer", description: "Test description" },
          ],
        }),
    });

    render(<CareerQuiz />);
    // Complete all quiz questions...

    await waitFor(() => {
      expect(
        screen.getByText(/Your Personalized Career Suggestions/i)
      ).toBeInTheDocument();
    });
  });
});
```

## 3. E2E Tests

```typescript
// cypress/e2e/career-journey.cy.ts
describe("Complete Career Discovery Journey", () => {
  it("should complete full user flow from quiz to roadmap", () => {
    cy.visit("/");

    // Take the quiz
    cy.contains("Take Quick Quiz").click();
    cy.url().should("include", "/quiz");

    // Answer all questions
    cy.get('[data-testid="quiz-option"]').first().click();
    cy.get('[data-testid="next-question"]').click();
    // ... repeat for all questions

    // View results
    cy.contains("Your Personalized Career Suggestions").should("be.visible");
    cy.get('[data-testid="explore-roadmap"]').first().click();

    // Should navigate to roadmap
    cy.url().should("include", "/roadmaps");
    cy.contains("Career Roadmap").should("be.visible");
  });

  it("should save roadmap when user is logged in", () => {
    cy.login(); // Custom command
    cy.visit("/roadmaps/software-engineer");

    cy.get('[data-testid="save-roadmap"]').click();
    cy.contains("Roadmap saved").should("be.visible");

    // Check if appears in profile
    cy.visit("/profile");
    cy.contains("software-engineer").should("be.visible");
  });
});
```

## 4. Performance Testing

```typescript
// tests/performance.test.ts
import { test, expect } from "@playwright/test";

test("page load performance", async ({ page }) => {
  const startTime = Date.now();

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds

  // Check Core Web Vitals
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries);
      }).observe({ entryTypes: ["navigation", "paint"] });
    });
  });

  // Assert performance metrics
});
```

## 5. API Testing

```typescript
// tests/api/quiz.test.ts
describe("Quiz API", () => {
  test("POST /api/quiz should return career suggestions", async () => {
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: {
          activity: "problem-solving",
          role: "leader",
          environment: "office",
          subject: "mathematics",
          priority: "salary",
        },
        quizType: "standard",
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.suggestions).toHaveLength(3);
    expect(data.suggestions[0]).toHaveProperty("career");
    expect(data.suggestions[0]).toHaveProperty("description");
  });
});
```
