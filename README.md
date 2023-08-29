# Close Best Practices Documentation

`close-best-practices` is a library and a tool to help teams document their
coding best practices.

(Interested in working on projects like this? [Close](https://www.close.com) is
looking for [great engineers](https://jobs.close.com) to join our team!)

## Philosophy

This library is built to embody the following principles:

1. Documentation should live as close to the code as possible (preferably in the
   code)
2. Documentation should be discoverable
3. Documentation should update automatically when the associated code changes
4. You shouldn't have to actually look at the code to read through our best
   practices

## Installation

You can install this package via npm:

    npm i --save-dev @closeio/best-practices-documentation

    yarn add -D @closeio/best-practices-documentation

## Tagging your Code as a Best Practice

You can tag blocks of code as a best practices with specially formatted
comments:

```tsx
// @BestPractice React Components
// @BestPractice.subtitle State Updates
// @BestPracitce.description
//   If you need to update state based on the current value, use
//   the functional version of the state setter rather than using
//   the `value`. This keeps `useCallback` from creating a new function
//  every time the value changes.
const [value, setValue] = useState(0);
const incrementValue = useCallback(
  () => setValue((currentValue) => currentValue + 1),
  [],
);
// @BestPractice.end
```

You can also document values in JSX blocks with the `{/* ... */}` comment
format.

Check out the sample project that is part of the code to see more examples.

### Limitations

- We currently do not support multiline comments.
- This tool only looks at files with `.js`, `.jsx`, `.ts`, and `.tsx` extensions

## Extracting Best Practices Documentation

To extract your best practices documentation, you can invoke our CLI tool:

    npx best-practices write -s src/ -g docs/best-practices -u "https://github.com/<your org>/<your repo>/tree/main"

This will scan through your code in `src` and build best practices markdown
files from your tagged code. The contents of the `-g` directory will be
completely overwritten, so make sure you point to a directory that doesn't
contain any manually written documentation.

This will also write out a `digest.txt` file that is used to track changes to
your generated documentation.

## Checking Docs Freshness

You can check to see if your generated docs are out of date with your code with
the `check` subcommand:

    npx best-practices check -s src/ -g docs/best-practices

This will gather your best practices documentation from your code and generate a
digest, and compare those to the digest that was written out the last time docs
were generated. The `check` command will exit with a status code of `1` if the
docs are out of date, making this a good command to use in a pre-commit hook or
a CI step.

## Inserting Blocks Into Static Documentation

If you'd like to insert (and keep up-to-date) some best practices into static
documentation, meaning docs that you type out yourself, and aren't completely
controlled by this tool, you can do that with specially formatted comments and
meta tags.

### In Your Code

In your code, add a `id` meta field to the documentation block:

    // @BestPractice.id insertIntoStaticDocs

This id should be unique throughout your codebase, but this is not checked or
enforced by the tool. If you have multiple best practice blocks with the same ID
then the last one picked up by the tool when parsing your code will be used.o

### In Static Documentation

In your static markdown documentation file, add a comment like this where you'd
like to insert a best practice:

    <!-- @BestPractice insertIntoStaticDocs -->
    <!-- @BestPractice.end -->

It's important to have both the start and end lines, as these will be used as
boundaries of the program to know where to replace the code.

### From the Command Line

In order to write out to static docs, you'll have to point the tool at your docs
root with the `-d` command line argument.

E.g.

    `npx best-practices write -s src/ -g docs/best-practices -d docs/ ...`

### Used IDs

If a best practice is inserted into static documentation, it will not be
inserted into the generated docs. It will however still be included in the
digest for checking doc freshness.

## Keeping Docs Up-to-date

There are several strategies for keeping your docs up-to-date:

1. Create a pre-commit hook that will run `best-pracitces write`
2. Create a pre-commit hook that will run `best-pracitces check`
3. Create a CI step that will run `best-pracitces check`
4. If you have a documentation system that automatically creates a static
   documentation site from your docs, you may be able to hook in the
   `best-pracitces` command as part of that.

## Customizing Docs Generation

If the default usage of the CLI tools doesn't fit your needs, you can use the
library to customize your best practice generation. We export all the primary
utility functions that the `write` and `check` CLI subcommands use, and you can
compose those as you need
