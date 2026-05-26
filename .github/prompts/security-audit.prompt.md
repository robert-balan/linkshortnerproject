---
agent: ask
---

Perform a security audit of the codebase, identifying potential vulnerabilities, security misconfigurations, and areas for improvement. Provide a detailed report with recommendations for addressing any issues found.

Output your findings as a markdown formatted table with the following columns ("ID" should start at 1 and auto increment, "File Path" should be an actual link to the file): "ID", "Severity", "Issue", "File Path", "Line Number(s)", and "Recommendations".

Next, ask the user which issues they want to fix by either replying "all", or a comma-separated list of IDs.
After the user reply, run a separate sub agent (#runSubagent) to fix each issue that the user has specified. Each sub agent should report back with a simple `subAgentSuccess: true | false`.
