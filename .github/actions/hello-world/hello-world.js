const core = require('@actions/core');
const github = require('@actions/github');

try {
  const token = core.getInput('repo-token');
  if (!token) return;

  const pullRequest = github.context.payload;
  // Create the octokit client
  const octokit = new github.GitHub(token);
  const nwo = process.env['GITHUB_REPOSITORY'] || '/';
  const [owner, repo] = nwo.split('/');
  console.log(JSON.stringify(pullRequest, undefined, 2));

  if (pullRequest.action === 'edited') {
    const from = pullRequest.changes.body.from;
    const to = pullRequest.pull_request.body;
    octokit.issues.createComment({
      owner,
      repo,
      issue_number: pullRequest.number,
      body: [`### The body of the PR was edited!`,
             `#### From`,
             `> ${from}`,
             `#### To`,
             `> ${to}`
           ].join("\n")
    });
  } else {
    // Created
  }
} catch (error) {
  core.setFailed(error.message);
}
