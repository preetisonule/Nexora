export interface ISeedLesson {
  title: string;
  slug: string;
  order: number;
  introduction: string;
  objectives: string[];
  readingContent: string;
  codeExamples: {
    title: string;
    code: string;
    expectedOutput: string;
    explanation: string;
    commonMistakes?: string[];
  }[];
  commonMistakes: string[];
  comparisonWithOtherLanguages?: {
    language: 'Java' | 'Python' | 'JavaScript';
    differences: string;
  };
  keyTakeaways: string[];
  knowledgeCheck?: {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  };
  estimatedDuration: string;
}

export interface ISeedAssignment {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Challenge';
  description: string;
  starterCode: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  referenceSolution: string;
  testCases: {
    input: string;
    expectedOutput: string;
    hidden: boolean;
    points: number;
    comparisonMode: 'exact' | 'trimmed' | 'case-insensitive';
  }[];
}

export interface ISeedQuizQuestion {
  prompt: string;
  type: 'single-select' | 'multiple-select' | 'true-false' | 'code-output';
  codeSnippet?: string;
  options: { id: string; text: string }[];
  correctAnswers: string[];
  explanation: string;
  points: number;
}

export interface ISeedModule {
  order: number;
  title: string;
  slug: string;
  description: string;
  objectives: string[];
  estimatedDuration: string;
  lessons: ISeedLesson[];
  assignments: ISeedAssignment[];
  quizQuestions: ISeedQuizQuestion[];
  moduleTestQuestions: ISeedQuizQuestion[];
}

export const SEED_MODULES: ISeedModule[] = [
  // ==========================================
  // MODULE 1
  // ==========================================
  {
    order: 1,
    title: 'Introduction to Go and Development Environment',
    slug: 'introduction-to-go-and-development-environment',
    description: 'Understand Go origins, philosophy, installation, toolchain, and write your first Go programs.',
    objectives: [
      'Understand why Go was created at Google and its core design philosophy',
      'Compare Go compilation and runtime model to Java, Python, and JavaScript',
      'Master the Go toolchain including go run, go build, and go fmt',
      'Initialize and structure modern Go projects using go modules',
    ],
    estimatedDuration: '4 hours',
    lessons: [
      {
        order: 1,
        title: 'What Is Go?',
        slug: 'what-is-go',
        introduction: 'Go (often called Golang) is an open-source, statically typed, compiled programming language designed at Google by Robert Griesemer, Rob Pike, and Ken Thompson.',
        objectives: ['Explore the history of Go', 'Understand simplicity and fast compilation in Go', 'Identify Go core use cases'],
        readingContent: `Go was born out of frustration with existing systems languages at Google in 2007. Software was becoming immensely distributed, multicore hardware was ubiquitous, yet builds took hours and dependencies were complex.\n\n### Go Core Philosophy:\n- **Simplicity Over Cleverness:** Only 25 keywords.\n- **Direct Machine Compilation:** Compiles directly to self-contained machine code with zero external runtime dependencies.\n- **First-Class Concurrency:** Goroutines and channels built directly into the language runtime.\n- **Built-in Garbage Collection:** Low-latency concurrent GC.`,
        codeExamples: [
          {
            title: 'Classic First Program',
            code: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Welcome to Comp!lo Learn Go Course")\n}`,
            expectedOutput: 'Welcome to Comp!lo Learn Go Course',
            explanation: 'Every executable Go program begins with package main and entrypoint func main(). fmt.Println prints formatted output to standard output.',
            commonMistakes: ['Putting code outside of a package declaration.', 'Importing packages without using them.'],
          },
        ],
        commonMistakes: ['Forgetting that Go is case-sensitive for exported identifiers.', 'Expecting classes or inheritance.'],
        comparisonWithOtherLanguages: {
          language: 'Python',
          differences: 'Unlike Python which is interpreted and dynamically typed, Go is compiled directly to native machine binaries and statically typed.',
        },
        keyTakeaways: ['Go was designed for scalable systems and developer productivity.', 'Go programs compile to standalone native executables.', 'Go rejects unnecessary complexity.'],
        knowledgeCheck: {
          question: 'Which of the following is true regarding Go executable programs?',
          options: ['They require a JVM or Node runtime to execute.', 'They must belong to "package main" and have a "main()" function.', 'They can have multiple main functions in the same package.', 'They are interpreted line by line at runtime.'],
          correctOptionIndex: 1,
          explanation: 'Executable Go programs must declare "package main" and define the entrypoint function "func main()".',
        },
        estimatedDuration: '25 mins',
      },
      {
        order: 2,
        title: 'Why Go? Comparing Go with Java, Python, and JavaScript',
        slug: 'why-go-comparing-languages',
        introduction: 'Discover how Go strikes the sweet spot between developer ergonomics, memory footprint, and CPU execution speed.',
        objectives: ['Analyze performance trade-offs', 'Examine memory management models', 'Understand concurrency differences'],
        readingContent: `When choosing Go over Java, Python, or JavaScript, engineers benefit from:\n\n1. **Zero Runtime Overhead:** No virtual machines or JIT warm-up.\n2. **Small Static Binaries:** Deploy a single binary inside minimal Docker scratch images.\n3. **Goroutines vs OS Threads:** Goroutines begin with just 2KB stack size vs 1MB+ in Java threads.\n4. **No Callback Hell:** Concurrent synchronous-style programming without promise chains or async/await syntax tax.`,
        codeExamples: [
          {
            title: 'Concurrent Execution in Go',
            code: `package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc greet(name string) {\n    fmt.Printf("Hello, %s!\\n", name)\n}\n\nfunc main() {\n    go greet("Gopher")\n    time.Sleep(10 * time.Millisecond)\n    fmt.Println("Main finished")\n}`,
            expectedOutput: "Hello, Gopher!\nMain finished",
            explanation: 'The go keyword spawns an asynchronous lightweight thread called a goroutine.',
          },
        ],
        commonMistakes: ['Allowing main() to exit before background goroutines complete.'],
        comparisonWithOtherLanguages: {
          language: 'Java',
          differences: 'Go does not require heavyweight JVM memory allocations and avoids class hierarchies in favor of implicit structural interfaces.',
        },
        keyTakeaways: ['Go produces lightweight static binaries.', 'Goroutines are vastly cheaper than OS threads.', 'Go offers fast build times and minimal cognitive overhead.'],
        knowledgeCheck: {
          question: 'What is the initial stack allocation size of a Go goroutine compared to a typical OS thread?',
          options: ['1MB vs 10MB', '2KB vs ~1MB', '100KB vs 100KB', 'Goroutines allocate no stack'],
          correctOptionIndex: 1,
          explanation: 'A goroutine starts with only ~2KB of stack space that grows and shrinks dynamically as needed.',
        },
        estimatedDuration: '30 mins',
      },
      {
        order: 3,
        title: 'Installing Go and Setting Up VS Code',
        slug: 'installing-go-and-vs-code',
        introduction: 'Learn how the Go compiler is installed, environment variables configured, and VS Code integrated with gopls language server.',
        objectives: ['Verify Go toolchain installation', 'Configure GOPATH and GOCACHE', 'Setup VS Code Go extension'],
        readingContent: `Go provides a straightforward single-archive installation across Linux, macOS, and Windows.\n\n### Essential Tools:\n- **go version:** Displays installed Go compiler version.\n- **go env:** Inspects all Go environment flags.\n- **gopls:** The official Go language server protocol providing code completion, refactoring, and linting.`,
        codeExamples: [
          {
            title: 'Inspecting Go Environment',
            code: `package main\n\nimport (\n    "fmt"\n    "runtime"\n)\n\nfunc main() {\n    fmt.Println("Go Version:", runtime.Version())\n    fmt.Println("OS/Arch:", runtime.GOOS, runtime.GOARCH)\n}`,
            expectedOutput: 'Go Version: go1.27.0\nOS/Arch: windows amd64',
            explanation: 'The runtime standard library package exposes information about the host architecture and Go runtime.',
          },
        ],
        commonMistakes: ['Manual GOPATH manipulation instead of relying on modern Go modules.'],
        keyTakeaways: ['The Go toolchain includes compiler, formatter, package manager, and test runner in one command.', 'gopls delivers first-class IDE intelligence.'],
        knowledgeCheck: {
          question: 'Which CLI command outputs the active configuration of all Go environment variables?',
          options: ['go config', 'go env', 'go settings', 'go inspect'],
          correctOptionIndex: 1,
          explanation: '"go env" lists all active environment variables including GOROOT, GOPATH, and compiler flags.',
        },
        estimatedDuration: '25 mins',
      },
      {
        order: 4,
        title: 'Your First Go Program',
        slug: 'your-first-go-program',
        introduction: 'Break down every line of an idiomatic Go program to understand packages, imports, and function syntax.',
        objectives: ['Deconstruct package declarations', 'Import standard packages', 'Implement main function logic'],
        readingContent: `Every piece of Go code lives in a package. A package groups related functions, structs, and variables.\n\n### Anatomy of a Program:\n1. \`package main\`: Identifies this file as part of an executable binary.\n2. \`import "fmt"\`: Imports standard formatting I/O package.\n3. \`func main() {}\`: The entry point with no arguments and no return value.`,
        codeExamples: [
          {
            title: 'Greeting Program',
            code: `package main\n\nimport "fmt"\n\nfunc main() {\n    var message = "Code with Go!"\n    fmt.Println(message)\n}`,
            expectedOutput: 'Code with Go!',
            explanation: 'Declares variable message with inferred type string and outputs it to console.',
          },
        ],
        commonMistakes: ['Placing an opening brace { on a new line. Go compiler inserts semicolons automatically!'],
        comparisonWithOtherLanguages: {
          language: 'JavaScript',
          differences: 'In JS, curly braces can be placed on a newline. In Go, placing { on a newline causes a compilation syntax error.',
        },
        keyTakeaways: ['Go uses automatic semicolon insertion.', 'Opening braces MUST be on the same line as the statement.', 'Unused imports will cause a compiler error.'],
        knowledgeCheck: {
          question: 'What happens in Go if you place the opening curly brace of func main() on a new line?',
          options: ['It compiles normally.', 'The compiler produces a syntax error because of automatic semicolon insertion.', 'It formats automatically on save without issue.', 'It runs with a runtime warning.'],
          correctOptionIndex: 1,
          explanation: 'The Go lexer automatically injects a semicolon after func main(), turning it into an illegal statement if { is on the next line.',
        },
        estimatedDuration: '30 mins',
      },
      {
        order: 5,
        title: 'The Go Toolchain: go run, go build, and go fmt',
        slug: 'the-go-toolchain',
        introduction: 'Master the fundamental CLI commands that make Go development fast and deterministic.',
        objectives: ['Distinguish go run from go build', 'Format code using go fmt', 'Enforce idiomatic styling'],
        readingContent: `Go ships with an opinionated and comprehensive toolchain:\n- \`go run main.go\`: Compiles and executes code in-memory temporarily.\n- \`go build\`: Compiles source code into a standalone executable file in current directory.\n- \`go fmt\`: Automatically formats all code to the official Go standard. No team debates about tabs vs spaces!`,
        codeExamples: [
          {
            title: 'Standard Formatting Demonstration',
            code: `package main\n\nimport "fmt"\n\nfunc main() {\n\t// Go standard formatting uses tabs for indentation\n\tfmt.Println("Formatted cleanly with go fmt")\n}`,
            expectedOutput: 'Formatted cleanly with go fmt',
            explanation: 'go fmt automatically reformats code to match standard Go convention.',
          },
        ],
        commonMistakes: ['Checking in unformatted code. Always run go fmt before committing.'],
        keyTakeaways: ['go fmt eliminates bike-shedding about code styles.', 'go build generates a standalone native binary without external dependencies.'],
        knowledgeCheck: {
          question: 'What is the main difference between "go run" and "go build"?',
          options: ['go run is only for tests.', 'go build creates a persistent native executable on disk, while go run compiles and runs in temp memory.', 'go run optimizes for production while go build does not.', 'There is no difference.'],
          correctOptionIndex: 1,
          explanation: '"go build" produces a compiled executable binary file, whereas "go run" compiles and executes the program without keeping the output binary.',
        },
        estimatedDuration: '30 mins',
      },
      {
        order: 6,
        title: 'Go Modules and go.mod',
        slug: 'go-modules-and-go-mod',
        introduction: 'Understand modern dependency management and project modularity with Go modules.',
        objectives: ['Initialize modules with go mod init', 'Inspect go.mod and go.sum files', 'Understand semantic versioning in Go'],
        readingContent: `Since Go 1.11+, Go modules are the official standard for dependency management.\n\n### Core Commands:\n- \`go mod init <module-path>\`: Creates a new \`go.mod\` file.\n- \`go mod tidy\`: Adds missing module requirements and removes unused ones.\n- \`go.sum\`: Contains cryptographic hashes for reproducible, secure builds.`,
        codeExamples: [
          {
            title: 'Module Structure Representation',
            code: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Module: github.com/compilo/learn-go")\n}`,
            expectedOutput: 'Module: github.com/compilo/learn-go',
            explanation: 'The module path provides a global unique namespace for your Go code packages.',
          },
        ],
        commonMistakes: ['Editing go.sum manually. Always let the go toolchain manage go.sum.'],
        keyTakeaways: ['go.mod defines module root and dependencies.', 'go.sum verifies checksums to prevent tampering.', 'go mod tidy cleans unused imports.'],
        knowledgeCheck: {
          question: 'Which command removes unused dependencies and downloads missing modules?',
          options: ['go clean', 'go mod tidy', 'go get -u', 'go install'],
          correctOptionIndex: 1,
          explanation: '"go mod tidy" ensures go.mod matches the actual imports in the source code.',
        },
        estimatedDuration: '30 mins',
      },
    ],
    assignments: [
      {
        title: 'Print a Formatted Introduction',
        slug: 'print-formatted-introduction',
        difficulty: 'Easy',
        description: 'Write a Go program that outputs "Hello, Go Developer!" followed by a newline, and then "Welcome to Comp!lo Learn."',
        starterCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n}`,
        examples: [
          { input: '', output: "Hello, Go Developer!\nWelcome to Comp!lo Learn.", explanation: 'Prints the two specified greeting lines.' },
        ],
        constraints: ['Must use fmt package', 'Must output exact strings'],
        hints: ['Use fmt.Println twice or fmt.Printf with newline \\n.'],
        referenceSolution: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go Developer!")\n    fmt.Println("Welcome to Comp!lo Learn.")\n}`,
        testCases: [
          { input: '', expectedOutput: "Hello, Go Developer!\nWelcome to Comp!lo Learn.", hidden: false, points: 10, comparisonMode: 'trimmed' },
        ],
      },
      {
        title: 'Echo User Input',
        slug: 'echo-user-input',
        difficulty: 'Easy',
        description: 'Read a single line from standard input using bufio.NewScanner or fmt.Scan, and print "Echo: " followed by the input.',
        starterCode: `package main\n\nimport (\n    "bufio"\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    scanner := bufio.NewScanner(os.Stdin)\n    if scanner.Scan() {\n        input := scanner.Text()\n        // Print formatted echo\n    }\n}`,
        examples: [
          { input: 'Gopher\n', output: 'Echo: Gopher', explanation: 'Echos the input word.' },
        ],
        constraints: ['Handle standard input gracefully.'],
        hints: ['fmt.Printf("Echo: %s\\n", input)'],
        referenceSolution: `package main\n\nimport (\n    "bufio"\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    scanner := bufio.NewScanner(os.Stdin)\n    if scanner.Scan() {\n        fmt.Printf("Echo: %s\\n", scanner.Text())\n    }\n}`,
        testCases: [
          { input: "Gopher\n", expectedOutput: "Echo: Gopher", hidden: false, points: 10, comparisonMode: 'trimmed' },
          { input: "Compilo Systems\n", expectedOutput: "Echo: Compilo Systems", hidden: true, points: 10, comparisonMode: 'trimmed' },
        ],
      },
      {
        title: 'Compute Square of Input',
        slug: 'compute-square-of-input',
        difficulty: 'Medium',
        description: 'Read an integer from standard input, calculate its square, and print "Square of X is Y".',
        starterCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    var n int\n    fmt.Scan(&n)\n    // Calculate and print result\n}`,
        examples: [
          { input: '5', output: 'Square of 5 is 25' },
        ],
        constraints: ['Input is an integer between -1000 and 1000.'],
        hints: ['Calculate n * n and format with fmt.Printf.'],
        referenceSolution: `package main\n\nimport "fmt"\n\nfunc main() {\n    var n int\n    if _, err := fmt.Scan(&n); err == nil {\n        fmt.Printf("Square of %d is %d\\n", n, n*n)\n    }\n}`,
        testCases: [
          { input: "5\n", expectedOutput: "Square of 5 is 25", hidden: false, points: 10, comparisonMode: 'trimmed' },
          { input: "12\n", expectedOutput: "Square of 12 is 144", hidden: true, points: 10, comparisonMode: 'trimmed' },
          { input: "-7\n", expectedOutput: "Square of -7 is 49", hidden: true, points: 10, comparisonMode: 'trimmed' },
        ],
      },
    ],
    quizQuestions: [
      {
        prompt: 'Which of the following is NOT a reserved keyword in Go?',
        type: 'single-select',
        options: [
          { id: '1', text: 'chan' },
          { id: '2', text: 'defer' },
          { id: '3', text: 'class' },
          { id: '4', text: 'select' },
        ],
        correctAnswers: ['3'],
        explanation: 'Go does not have classes or the "class" keyword. Object-oriented patterns are achieved using structs and interfaces.',
        points: 10,
      },
      {
        prompt: 'What happens when you import a package in Go but never use any identifier from it?',
        type: 'single-select',
        options: [
          { id: '1', text: 'The program compiles with a runtime warning.' },
          { id: '2', text: 'The Go compiler rejects the code with a compile-time error.' },
          { id: '3', text: 'The unused package is automatically stripped during linking silently.' },
          { id: '4', text: 'Go creates a stub import.' },
        ],
        correctAnswers: ['2'],
        explanation: 'Go strictly forbids unused imports to prevent code bloat and dependency rot; it results in a compile error.',
        points: 10,
      },
    ],
    moduleTestQuestions: [
      {
        prompt: 'What is the purpose of the go.sum file in a Go module?',
        type: 'single-select',
        options: [
          { id: '1', text: 'It contains the compiled binary checksum.' },
          { id: '2', text: 'It records expected cryptographic checksums of specific module versions for security and reproducible builds.' },
          { id: '3', text: 'It lists compiler optimization flags.' },
          { id: '4', text: 'It tracks code test coverage metrics.' },
        ],
        correctAnswers: ['2'],
        explanation: 'go.sum acts as a cryptographic lockfile verifying that dependencies have not been tampered with.',
        points: 15,
      },
      {
        prompt: 'Which command compiles Go code and immediately runs the resulting temporary binary?',
        type: 'single-select',
        options: [
          { id: '1', text: 'go compile' },
          { id: '2', text: 'go exec' },
          { id: '3', text: 'go run' },
          { id: '4', text: 'go start' },
        ],
        correctAnswers: ['3'],
        explanation: '"go run" builds and runs the main package in an ephemeral directory.',
        points: 15,
      },
      {
        prompt: 'What package name must be used for an executable program in Go?',
        type: 'single-select',
        options: [
          { id: '1', text: 'package app' },
          { id: '2', text: 'package main' },
          { id: '3', text: 'package root' },
          { id: '4', text: 'package exec' },
        ],
        correctAnswers: ['2'],
        explanation: 'Go requires "package main" to produce an executable binary.',
        points: 10,
      },
    ],
  },

  // ==========================================
  // MODULE 2
  // ==========================================
  {
    order: 2,
    title: 'Variables, Data Types, and Operators',
    slug: 'variables-data-types-and-operators',
    description: 'Master Go static typing, short declarations, constants, numeric types, type conversion, and formatting with fmt.',
    objectives: [
      'Declare variables using var and short declaration syntax (:=)',
      'Understand zero values and explicit type conversions',
      'Work with typed and untyped constants and iota',
      'Master formatting verbs with fmt.Printf',
    ],
    estimatedDuration: '4.5 hours',
    lessons: [
      {
        order: 1,
        title: 'Variables and Short Variable Declarations',
        slug: 'variables-and-short-declarations',
        introduction: 'Learn the two primary ways to declare variables in Go: var and the := short assignment operator.',
        objectives: ['Use var with explicit type', 'Use short variable declaration := inside functions', 'Understand variable scope'],
        readingContent: `In Go, all variables are statically typed.\n\n### Declaration Forms:\n1. \`var x int = 10\`: Explicit type.\n2. \`var x = 10\`: Inferred type.\n3. \`x := 10\`: Short declaration (only valid within function bodies).\n\nNote: \`:=\` cannot be used at package level. Package-level variables must use \`var\`.`,
        codeExamples: [
          {
            title: 'Variable Declarations',
            code: `package main\n\nimport "fmt"\n\nvar packageLevel = "Accessible anywhere in package"\n\nfunc main() {\n    var count int = 5\n    name := "Gopher"\n    fmt.Printf("%s has %d items\\n", name, count)\n}`,
            expectedOutput: 'Gopher has 5 items',
            explanation: 'name uses short declaration := while count uses standard var syntax.',
          },
        ],
        commonMistakes: ['Trying to use := at package level outside of functions.', 'Declaring a variable inside a function without ever using it.'],
        comparisonWithOtherLanguages: {
          language: 'JavaScript',
          differences: 'In JS, variables declared with let/const can change type dynamically if untyped. In Go, := infers a permanent static type at compile time.',
        },
        keyTakeaways: [':= is only allowed inside function bodies.', 'Unused local variables cause compile-time errors.', 'Package variables use var.'],
        knowledgeCheck: {
          question: 'Where is the short variable declaration operator (:=) legally allowed?',
          options: ['Anywhere in a Go file', 'Only at package level', 'Only inside function bodies', 'Only inside struct declarations'],
          correctOptionIndex: 2,
          explanation: ':= is shorthand only available inside function bodies.',
        },
        estimatedDuration: '30 mins',
      },
      {
        order: 2,
        title: 'Constants and Type Inference',
        slug: 'constants-and-type-inference',
        introduction: 'Explore compile-time constants, untyped constants, and the iota enumerator.',
        objectives: ['Declare const values', 'Use untyped numeric constants', 'Generate enums with iota'],
        readingContent: `Constants in Go are values determined strictly at compile time.\n\n### The iota Identifier:\n\`iota\` represents successive integer untyped constants starting at 0 within a \`const\` block.`,
        codeExamples: [
          {
            title: 'Using iota for Enums',
            code: `package main\n\nimport "fmt"\n\nconst (\n    Pending = iota\n    Running\n    Completed\n)\n\nfunc main() {\n    fmt.Printf("Pending: %d, Running: %d, Completed: %d\\n", Pending, Running, Completed)\n}`,
            expectedOutput: 'Pending: 0, Running: 1, Completed: 2',
            explanation: 'iota automatically increments for each constant defined in the block.',
          },
        ],
        commonMistakes: ['Trying to assign a runtime function result to a const.'],
        keyTakeaways: ['Constants cannot change at runtime.', 'iota generates sequential enumerations.', 'Untyped constants have high precision.'],
        knowledgeCheck: {
          question: 'What is the value of iota at the first line of a const declaration block?',
          options: ['1', '0', '-1', 'null'],
          correctOptionIndex: 1,
          explanation: 'iota starts at index 0 and increments with each line.',
        },
        estimatedDuration: '30 mins',
      },
      {
        order: 3,
        title: 'Numeric, Boolean, and String Types',
        slug: 'numeric-boolean-string-types',
        introduction: 'Dive into Go foundational types: int8 through int64, uint, float32, float64, bool, and UTF-8 strings.',
        objectives: ['Choose correct numeric bit-widths', 'Work with boolean logic', 'Understand immutable strings'],
        readingContent: `Go provides explicit numeric bit sizes:\n- \`int\`, \`uint\`: Platform-dependent (32 or 64 bits).\n- \`int8\`, \`int16\`, \`int32\`, \`int64\`: Fixed bit-width signed integers.\n- \`float32\`, \`float64\`: IEEE-754 floating points.\n- \`bool\`: \`true\` or \`false\` (cannot be converted to integer 0/1).\n- \`string\`: An immutable sequence of bytes, typically UTF-8 encoded.`,
        codeExamples: [
          {
            title: 'Basic Types Demonstration',
            code: `package main\n\nimport "fmt"\n\nfunc main() {\n    var active bool = true\n    var pi float64 = 3.14159\n    var greeting string = "Hello, 世界"\n    fmt.Printf("%t | %.2f | %s\\n", active, pi, greeting)\n}`,
            expectedOutput: 'true | 3.14 | Hello, 世界',
            explanation: 'Demonstrates formatting verbs: %t for boolean, %.2f for float with precision, and %s for string.',
          },
        ],
        commonMistakes: ['Assuming int and int64 are interchangeable. In Go, they are distinct types requiring explicit conversion!'],
        keyTakeaways: ['Strings in Go are read-only byte slices.', 'Booleans cannot be treated as numbers.', 'int and int64 are separate types.'],
        knowledgeCheck: {
          question: 'Can you assign an int32 variable directly to an int64 variable without explicit conversion?',
          options: ['Yes, Go performs implicit widening.', 'No, Go requires explicit type conversion between different numeric types.', 'Yes, but only for positive values.', 'Only if wrapped in an interface.'],
          correctOptionIndex: 1,
          explanation: 'Go never performs implicit type conversion, even between integers of different bit-widths.',
        },
        estimatedDuration: '30 mins',
      },
      {
        order: 4,
        title: 'Type Conversion and Zero Values',
        slug: 'type-conversion-and-zero-values',
        introduction: 'Discover how Go guarantees memory safety through default zero values and explicit casting.',
        objectives: ['Learn zero values for all primitive types', 'Convert between numeric types explicitly', 'Avoid undefined memory garbage'],
        readingContent: `In Go, uninitialized variables are NOT \`undefined\` or garbage memory. They are initialized to their **zero value**:\n- Numeric: \`0\`\n- Boolean: \`false\`\n- String: \`""\` (empty string)\n- Pointer / Slice / Map / Channel: \`nil\`\n\n### Explicit Conversions:\n\`T(v)\` converts value \`v\` to type \`T\`. For example: \`float64(integerVar)\`.`,
        codeExamples: [
          {
            title: 'Zero Values in Action',
            code: `package main\n\nimport "fmt"\n\nfunc main() {\n    var i int\n    var f float64\n    var b bool\n    var s string\n    fmt.Printf("int: %d, float: %f, bool: %t, string: '%s'\\n", i, f, b, s)\n}`,
            expectedOutput: "int: 0, float: 0.000000, bool: false, string: ''",
            explanation: 'All variables hold safe, deterministic zero values upon declaration.',
          },
        ],
        commonMistakes: ['Thinking uninitialized pointers or strings hold garbage data.'],
        keyTakeaways: ['Go variables always have a predictable zero value.', 'Type conversions must always be written explicitly.'],
        knowledgeCheck: {
          question: 'What is the zero value of an uninitialized string in Go?',
          options: ['null', 'nil', '"" (empty string)', 'undefined'],
          correctOptionIndex: 2,
          explanation: 'Strings in Go default to "" (empty string), never nil.',
        },
        estimatedDuration: '25 mins',
      },
      {
        order: 5,
        title: 'Operators and Expressions',
        slug: 'operators-and-expressions',
        introduction: 'Examine arithmetic, comparison, logical, and bitwise operators.',
        objectives: ['Use arithmetic and compound operators', 'Perform comparison operations', 'Understand ++ and -- as statements, not expressions'],
        readingContent: `Go supports standard arithmetic operators (\`+\`, \`-\`, \`*\`, \`/\`, \`%\`).\n\n### Critical Difference with C/Java/JS:\nIn Go, \`++\` and \`--\` are **statements**, NOT expressions!\n- \`i++\` is valid as a standalone line.\n- \`x = i++\` or \`++i\` is a compile error!`,
        codeExamples: [
          {
            title: 'Operators and Increment',
            code: `package main\n\nimport "fmt"\n\nfunc main() {\n    a := 10\n    b := 3\n    fmt.Printf("Division: %d, Remainder: %d\\n", a/b, a%b)\n    a++\n    fmt.Printf("After increment: %d\\n", a)\n}`,
            expectedOutput: "Division: 3, Remainder: 1\nAfter increment: 11",
            explanation: 'Shows integer division truncation, modulus, and postfix increment statement.',
          },
        ],
        commonMistakes: ['Writing ++i or trying to use i++ inside an expression like funcCall(i++).'],
        keyTakeaways: ['++ and -- are statements, eliminating pre/post-increment confusion.', 'Integer division truncates towards zero.'],
        knowledgeCheck: {
          question: 'Which of the following lines will compile without error in Go?',
          options: ['x := ++y', 'y++; fmt.Println(y)', 'fmt.Println(y++)', 'x = y++'],
          correctOptionIndex: 1,
          explanation: 'In Go, y++ is a statement and cannot be evaluated as an expression inside another statement.',
        },
        estimatedDuration: '25 mins',
      },
      {
        order: 6,
        title: 'Input and Output Using fmt',
        slug: 'input-and-output-using-fmt',
        introduction: 'Master standard formatting, printing, and scanning using the fmt package.',
        objectives: ['Format strings with Printf verbs (%v, %+v, %T, %d, %s)', 'Generate formatted strings with Sprintf', 'Read user input with Scan and Scanln'],
        readingContent: `The \`fmt\` package implements formatted I/O analogously to C's printf and scanf.\n\n### Useful Formatting Verbs:\n- \`%v\`: Default format for any value\n- \`%+v\`: Struct with field names\n- \`%T\`: Type of value\n- \`%d\`: Base 10 integer\n- \`%f\` / \`%.2f\`: Floating point\n- \`%s\`: String\n- \`%t\`: Boolean`,
        codeExamples: [
          {
            title: 'Formatting With Verbs',
            code: `package main\n\nimport "fmt"\n\nfunc main() {\n    item := "Laptop"\n    price := 999.99\n    fmt.Printf("%s costs $%.2f (Type: %T)\\n", item, price, price)\n}`,
            expectedOutput: 'Laptop costs $999.99 (Type: float64)',
            explanation: 'Uses %s for string, %.2f for float with two decimal places, and %T to print type.',
          },
        ],
        commonMistakes: ['Passing non-pointer to fmt.Scanf or fmt.Scan.'],
        keyTakeaways: ['fmt.Sprintf formats and returns a string without printing.', 'fmt.Printf outputs directly to stdout.'],
        knowledgeCheck: {
          question: 'Which fmt verb prints the Go data type of a variable?',
          options: ['%t', '%v', '%T', '%type'],
          correctOptionIndex: 2,
          explanation: '%T outputs the type of the value passed.',
        },
        estimatedDuration: '30 mins',
      },
    ],
    assignments: [
      {
        title: 'Build a Basic Calculator',
        slug: 'build-basic-calculator',
        difficulty: 'Easy',
        description: 'Read two floating-point numbers and an operator (+, -, *, /) from standard input. Output the calculated result rounded to 2 decimal places.',
        starterCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    var a, b float64\n    var op string\n    fmt.Scan(&a, &op, &b)\n    // Calculate and print result formatted to 2 decimals\n}`,
        examples: [
          { input: '10.5 + 4.5', output: '15.00' },
          { input: '20 * 3.5', output: '70.00' },
        ],
        constraints: ['Division by zero is guaranteed not to occur in test cases.'],
        hints: ['Use switch op { case "+": ... } and fmt.Printf("%.2f\\n", res)'],
        referenceSolution: `package main\n\nimport "fmt"\n\nfunc main() {\n    var a, b float64\n    var op string\n    if _, err := fmt.Scan(&a, &op, &b); err == nil {\n        var res float64\n        switch op {\n        case "+": res = a + b\n        case "-": res = a - b\n        case "*": res = a * b\n        case "/": res = a / b\n        }\n        fmt.Printf("%.2f\\n", res)\n    }\n}`,
        testCases: [
          { input: "10.5 + 4.5\n", expectedOutput: "15.00", hidden: false, points: 10, comparisonMode: 'trimmed' },
          { input: "20.0 * 3.5\n", expectedOutput: "70.00", hidden: true, points: 10, comparisonMode: 'trimmed' },
          { input: "50.0 - 15.25\n", expectedOutput: "34.75", hidden: true, points: 10, comparisonMode: 'trimmed' },
        ],
      },
      {
        title: 'Convert Temperature Units',
        slug: 'convert-temperature-units',
        difficulty: 'Medium',
        description: 'Read a Celsius temperature as a float and convert it to Fahrenheit using the formula F = (C * 9/5) + 32. Print "C°C = F°F" with 1 decimal place.',
        starterCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    var c float64\n    fmt.Scan(&c)\n    // Convert and output\n}`,
        examples: [
          { input: '100', output: '100.0°C = 212.0°F' },
          { input: '0', output: '0.0°C = 32.0°F' },
        ],
        constraints: ['Input float is between -273.15 and 1000.'],
        hints: ['f := (c * 9.0 / 5.0) + 32.0'],
        referenceSolution: `package main\n\nimport "fmt"\n\nfunc main() {\n    var c float64\n    if _, err := fmt.Scan(&c); err == nil {\n        f := (c * 9.0 / 5.0) + 32.0\n        fmt.Printf("%.1f°C = %.1f°F\\n", c, f)\n    }\n}`,
        testCases: [
          { input: "100\n", expectedOutput: "100.0°C = 212.0°F", hidden: false, points: 10, comparisonMode: 'trimmed' },
          { input: "0\n", expectedOutput: "0.0°C = 32.0°F", hidden: true, points: 10, comparisonMode: 'trimmed' },
          { input: "37\n", expectedOutput: "37.0°C = 98.6°F", hidden: true, points: 10, comparisonMode: 'trimmed' },
        ],
      },
    ],
    quizQuestions: [
      {
        prompt: 'Which operator is used for short variable declaration in Go?',
        type: 'single-select',
        options: [
          { id: '1', text: '=' },
          { id: '2', text: ':=' },
          { id: '3', text: '==' },
          { id: '4', text: '->' },
        ],
        correctAnswers: ['2'],
        explanation: ':= declares and initializes a variable with inferred type inside function scope.',
        points: 10,
      },
      {
        prompt: 'What is the zero value of a boolean variable in Go?',
        type: 'single-select',
        options: [
          { id: '1', text: 'true' },
          { id: '2', text: 'false' },
          { id: '3', text: '0' },
          { id: '4', text: 'nil' },
        ],
        correctAnswers: ['2'],
        explanation: 'Uninitialized booleans in Go default to false.',
        points: 10,
      },
    ],
    moduleTestQuestions: [
      {
        prompt: 'Which statement correctly describes Go constants?',
        type: 'single-select',
        options: [
          { id: '1', text: 'Constants can be assigned results of runtime functions.' },
          { id: '2', text: 'Constants must be evaluated strictly at compile time.' },
          { id: '3', text: 'Constants can be modified with pointers.' },
          { id: '4', text: 'Constants can only be of string type.' },
        ],
        correctAnswers: ['2'],
        explanation: 'Go constants are strictly compile-time constructs.',
        points: 15,
      },
      {
        prompt: 'What will fmt.Printf("%d", 15/4) output?',
        type: 'single-select',
        options: [
          { id: '1', text: '3.75' },
          { id: '2', text: '3' },
          { id: '3', text: '4' },
          { id: '4', text: 'Runtime error' },
        ],
        correctAnswers: ['2'],
        explanation: 'Integer division in Go truncates the decimal remainder towards zero.',
        points: 15,
      },
    ],
  },
];
