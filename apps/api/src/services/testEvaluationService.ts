import { GoExecutionService } from './goExecutionService';
import { ITestCaseDocument } from '../models/TestCase';
import { ITestResult } from '@compilo/shared';

export interface EvaluationResult {
  executionStatus: 'success' | 'compile-error' | 'runtime-error' | 'timeout' | 'output-limit';
  passedTests: number;
  totalTests: number;
  score: number;
  passed: boolean;
  testResults: ITestResult[];
  learnerTestResults: ITestResult[]; // Hidden test inputs and expected outputs redacted
  totalExecutionTimeMs: number;
}

export class TestEvaluationService {
  private static normalizeOutput(output: string, mode: 'exact' | 'trimmed' | 'regex' | 'case-insensitive'): string {
    const normalized = output.replace(/\r\n/g, '\n');
    if (mode === 'trimmed') {
      return normalized.trim();
    }
    if (mode === 'case-insensitive') {
      return normalized.trim().toLowerCase();
    }
    return normalized;
  }

  private static compareOutputs(
    actual: string,
    expected: string,
    mode: 'exact' | 'trimmed' | 'regex' | 'case-insensitive'
  ): boolean {
    if (mode === 'regex') {
      try {
        const regex = new RegExp(expected.trim());
        return regex.test(actual.trim());
      } catch {
        return false;
      }
    }

    const normActual = this.normalizeOutput(actual, mode);
    const normExpected = this.normalizeOutput(expected, mode);
    return normActual === normExpected;
  }

  public static async evaluate(
    sourceCode: string,
    testCases: ITestCaseDocument[],
    passingScorePercent: number = 100
  ): Promise<EvaluationResult> {
    const testResults: ITestResult[] = [];
    const learnerTestResults: ITestResult[] = [];

    let totalExecutionTimeMs = 0;
    let overallStatus: 'success' | 'compile-error' | 'runtime-error' | 'timeout' | 'output-limit' = 'success';

    let totalPoints = 0;
    let earnedPoints = 0;

    // Compile once, then run the binary for every test case input
    const runResults = await GoExecutionService.executeWithInputs(
      sourceCode,
      testCases.map((tc) => tc.input || '')
    );

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const runResult = runResults[i];
      const points = testCase.points || 10;
      totalPoints += points;

      totalExecutionTimeMs += runResult.executionTimeMs;

      if (runResult.timedOut) {
        overallStatus = 'timeout';
      } else if (runResult.compileError && overallStatus === 'success') {
        overallStatus = 'compile-error';
      } else if (runResult.runtimeError && overallStatus === 'success') {
        overallStatus = 'runtime-error';
      }

      const passed =
        !runResult.compileError &&
        !runResult.runtimeError &&
        !runResult.timedOut &&
        this.compareOutputs(runResult.stdout, testCase.expectedOutput, testCase.comparisonMode);

      if (passed) {
        earnedPoints += points;
      }

      const fullResult: ITestResult = {
        testCaseId: testCase._id.toString(),
        passed,
        hidden: testCase.hidden,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: runResult.stdout,
        executionTimeMs: runResult.executionTimeMs,
        error: runResult.compileError || runResult.runtimeError || undefined,
      };
      testResults.push(fullResult);

      // Redact details for hidden tests when shown to learners
      const learnerResult: ITestResult = {
        testCaseId: testCase._id.toString(),
        passed,
        hidden: testCase.hidden,
        input: testCase.hidden ? undefined : testCase.input,
        expectedOutput: testCase.hidden ? undefined : testCase.expectedOutput,
        actualOutput: testCase.hidden ? undefined : runResult.stdout,
        executionTimeMs: runResult.executionTimeMs,
        error: testCase.hidden ? (runResult.compileError ? 'Compilation error' : undefined) : (runResult.compileError || runResult.runtimeError || undefined),
      };
      learnerTestResults.push(learnerResult);
    }

    const passedTests = testResults.filter((r) => r.passed).length;
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const isPassing = score >= passingScorePercent;

    return {
      executionStatus: overallStatus,
      passedTests,
      totalTests: testCases.length,
      score,
      passed: isPassing,
      testResults,
      learnerTestResults,
      totalExecutionTimeMs,
    };
  }
}
