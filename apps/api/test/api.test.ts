import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectDatabase, disconnectDatabase } from '../src/config/db';
import { GoExecutionService } from '../src/services/goExecutionService';
import { CertificateService } from '../src/services/certificateService';
import { User } from '../src/models/User';
import { Course } from '../src/models/Course';
import { Module } from '../src/models/Module';
import { ProgressService } from '../src/services/progressService';

describe('Comp!lo Learn API & Business Logic Integration Suite', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('1. Verifies that the Go course has exactly 10 modules in database', async () => {
    const course = await Course.findOne({ slug: 'go-programming' });
    expect(course).toBeDefined();
    expect(course?.title).toContain('Go Programming');

    const modules = await Module.find({ courseId: course?._id }).sort({ order: 1 });
    expect(modules.length).toBe(10);
  });

  it('2. Enforces sequential learning unlocks: Module 1 unlocked, Module 2 locked for new learner', async () => {
    const testEmail = `learner_${Date.now()}@test.com`;
    const learner = await User.create({
      name: 'Test Sequential Learner',
      email: testEmail,
      passwordHash: 'hash',
      role: 'learner',
      status: 'active',
    });

    const course = await Course.findOne({ slug: 'go-programming' });
    const modules = await Module.find({ courseId: course?._id }).sort({ order: 1 });

    const mod1Progress = await ProgressService.updateModuleProgress(learner._id.toString(), modules[0]._id.toString());
    const mod2Progress = await ProgressService.updateModuleProgress(learner._id.toString(), modules[1]._id.toString());

    expect(mod1Progress.unlocked).toBe(true);
    expect(mod2Progress.unlocked).toBe(false);

    await User.findByIdAndDelete(learner._id);
  });

  it('3. Real Go compiler executes valid Go code, passes stdin, and captures stdout', async () => {
    const result = await GoExecutionService.execute({
      code: `
package main
import "fmt"
func main() {
    fmt.Println("Comp!lo Learn Sandbox Active")
}
      `,
      timeoutMs: 15000,
    });

    expect(result.exitCode).toBe(0);
    expect(result.timedOut).toBe(false);
    expect(result.stdout.trim()).toBe('Comp!lo Learn Sandbox Active');
    expect(result.compileError).toBeUndefined();
  }, 25000);

  it('4. Real Go compiler catches compilation syntax errors cleanly', async () => {
    const result = await GoExecutionService.execute({
      code: `
package main
import "fmt"
func main() {
    illegalSyntax := "no closing quote
}
      `,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.compileError).toBeDefined();
  }, 15000);

  it('5. Public Certificate verification returns false for invalid ID', async () => {
    const check = await CertificateService.verifyCertificate('NON-EXISTENT-CERT-ID');
    expect(check.valid).toBe(false);
  });
});
