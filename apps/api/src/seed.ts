import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from './config/db';
import { config } from './config';
import { User } from './models/User';
import { Course } from './models/Course';
import { Module } from './models/Module';
import { Lesson } from './models/Lesson';
import { Quiz } from './models/Quiz';
import { Question } from './models/Question';
import { Assignment } from './models/Assignment';
import { TestCase } from './models/TestCase';

import { SEED_MODULES } from './seedData/modulesData';
import { SEED_MODULES_PART2 } from './seedData/modulesDataPart2';
import { SEED_MODULES_PART3 } from './seedData/modulesDataPart3';

const runSeed = async () => {
  try {
    console.log('[Seed] Starting Comp!lo Learn database seed...');
    await connectDatabase();

    // 1. Seed or Update Administrator
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash(config.admin.password, salt);

    const admin = await User.findOneAndUpdate(
      { email: config.admin.email.toLowerCase() },
      {
        name: config.admin.name,
        email: config.admin.email.toLowerCase(),
        passwordHash: adminPasswordHash,
        role: 'superadmin',
        status: 'active',
      },
      { upsert: true, new: true }
    );
    console.log(`[Seed] Superadmin seeded: ${admin.email}`);

    // 2. Seed Default Course
    const course = await Course.findOneAndUpdate(
      { slug: 'go-programming' },
      {
        title: 'Go Programming: Beginner to Intermediate',
        slug: 'go-programming',
        description:
          'Learn Go programming through structured lessons, practical coding assignments, interactive assessments, and a guided project. Build your skills one module at a time.',
        level: 'Beginner',
        prerequisites: ['Basic understanding of any programming language (Python, JavaScript, or Java)'],
        learningObjectives: [
          'Master Go syntax, types, and the toolchain',
          'Understand memory models, pointers, and structs',
          'Write idiomatic Go with error handling and interfaces',
          'Build concurrent applications using Goroutines and Channels',
          'Test and benchmark code using standard tools',
          'Build and ship a production CLI project in Go',
        ],
        estimatedDuration: '50 hours',
        published: true,
        createdBy: admin._id,
      },
      { upsert: true, new: true }
    );
    console.log(`[Seed] Course seeded: ${course.title}`);

    // Combine all 10 modules
    const allModules = [...SEED_MODULES, ...SEED_MODULES_PART2, ...SEED_MODULES_PART3];
    console.log(`[Seed] Total modules to seed: ${allModules.length}`);

    // Track previous module for sequential prerequisite linking
    let previousModuleId: any = null;

    let totalLessonsCount = 0;
    let totalAssignmentsCount = 0;
    let totalQuizzesCount = 0;

    for (const modData of allModules) {
      // Create or update module
      const mod = await Module.findOneAndUpdate(
        { courseId: course._id, order: modData.order },
        {
          courseId: course._id,
          title: modData.title,
          slug: modData.slug,
          order: modData.order,
          description: modData.description,
          objectives: modData.objectives,
          prerequisiteModuleIds: previousModuleId ? [previousModuleId] : [],
          estimatedDuration: modData.estimatedDuration,
          completionRules: {
            requireAllLessons: true,
            requireQuizzesPass: true,
            requireAssignmentsPass: true,
            requireModuleTestPass: true,
            passingScorePercent: 70,
          },
          published: true,
        },
        { upsert: true, new: true }
      );

      previousModuleId = mod._id;

      // 3. Seed Lessons
      for (const lesData of modData.lessons) {
        await Lesson.findOneAndUpdate(
          { moduleId: mod._id, order: lesData.order },
          {
            moduleId: mod._id,
            title: lesData.title,
            slug: lesData.slug,
            order: lesData.order,
            introduction: lesData.introduction,
            objectives: lesData.objectives,
            readingContent: lesData.readingContent,
            codeExamples: lesData.codeExamples,
            commonMistakes: lesData.commonMistakes,
            comparisonWithOtherLanguages: lesData.comparisonWithOtherLanguages,
            keyTakeaways: lesData.keyTakeaways,
            knowledgeCheck: lesData.knowledgeCheck,
            estimatedDuration: lesData.estimatedDuration,
            published: true,
          },
          { upsert: true, new: true }
        );
        totalLessonsCount++;
      }

      // 4. Seed Quizzes and Module Test
      if (modData.quizQuestions && modData.quizQuestions.length > 0) {
        const quiz = await Quiz.findOneAndUpdate(
          { moduleId: mod._id, isModuleTest: false },
          {
            moduleId: mod._id,
            isModuleTest: false,
            title: `${modData.title} — Concept Quiz`,
            instructions: 'Answer all questions to verify your understanding of core concepts.',
            passingScore: 70,
            maxAttempts: 5,
            published: true,
          },
          { upsert: true, new: true }
        );

        // Delete existing questions to prevent duplicates and reinsert
        await Question.deleteMany({ quizId: quiz._id });
        for (let i = 0; i < modData.quizQuestions.length; i++) {
          const q = modData.quizQuestions[i];
          await Question.create({
            quizId: quiz._id,
            type: q.type,
            prompt: q.prompt,
            codeSnippet: q.codeSnippet,
            options: q.options,
            correctAnswers: q.correctAnswers,
            explanation: q.explanation,
            points: q.points,
            order: i + 1,
          });
        }
        totalQuizzesCount++;
      }

      if (modData.moduleTestQuestions && modData.moduleTestQuestions.length > 0) {
        const moduleTest = await Quiz.findOneAndUpdate(
          { moduleId: mod._id, isModuleTest: true },
          {
            moduleId: mod._id,
            isModuleTest: true,
            title: `Module ${modData.order} Comprehensive Test`,
            instructions: 'Final module assessment. A passing score of 70% is required to complete this module.',
            passingScore: 70,
            maxAttempts: 3,
            timeLimitMinutes: 20,
            published: true,
          },
          { upsert: true, new: true }
        );

        await Question.deleteMany({ quizId: moduleTest._id });
        for (let i = 0; i < modData.moduleTestQuestions.length; i++) {
          const q = modData.moduleTestQuestions[i];
          await Question.create({
            quizId: moduleTest._id,
            type: q.type,
            prompt: q.prompt,
            codeSnippet: q.codeSnippet,
            options: q.options,
            correctAnswers: q.correctAnswers,
            explanation: q.explanation,
            points: q.points,
            order: i + 1,
          });
        }
        totalQuizzesCount++;
      }

      // 5. Seed Coding Assignments
      for (const assData of modData.assignments) {
        const assignment = await Assignment.findOneAndUpdate(
          { moduleId: mod._id, slug: assData.slug },
          {
            moduleId: mod._id,
            title: assData.title,
            slug: assData.slug,
            description: assData.description,
            difficulty: assData.difficulty,
            starterCode: assData.starterCode,
            executionMode: 'stdio',
            examples: assData.examples,
            constraints: assData.constraints,
            hints: assData.hints,
            referenceSolution: assData.referenceSolution,
            timeLimitMs: 6000,
            memoryLimitMb: 128,
            passingScore: 100,
            published: true,
          },
          { upsert: true, new: true }
        );

        // Delete existing test cases and re-insert
        await TestCase.deleteMany({ assignmentId: assignment._id });
        for (let t = 0; t < assData.testCases.length; t++) {
          const tc = assData.testCases[t];
          await TestCase.create({
            assignmentId: assignment._id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            hidden: tc.hidden,
            points: tc.points,
            comparisonMode: tc.comparisonMode,
            order: t + 1,
          });
        }
        totalAssignmentsCount++;
      }
    }

    console.log('=========================================');
    console.log('Database Seeding Completed Successfully!');
    console.log(`- Course: ${course.title}`);
    console.log(`- Modules seeded: ${allModules.length}`);
    console.log(`- Lessons seeded: ${totalLessonsCount}`);
    console.log(`- Assignments seeded: ${totalAssignmentsCount}`);
    console.log(`- Quizzes/Tests seeded: ${totalQuizzesCount}`);
    console.log(`- Admin login: ${config.admin.email}`);
    console.log(`- Admin password: ${config.admin.password}`);
    console.log('=========================================');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

runSeed();
