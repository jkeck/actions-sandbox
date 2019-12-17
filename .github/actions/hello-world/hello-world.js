const core = require('@actions/core');
const github = require('@actions/github');

try {
  const token = process.env['GITHUB_TOKEN'];
  if (!token) return

  // Create the octokit client
  const octokit: github.GitHub = new github.GitHub(token)
  const nwo = process.env['GITHUB_REPOSITORY'] || '/'
  const [owner, repo] = nwo.split('/')
  console.log(`Owner: ${owner}`);
  console.log(`Repo: ${repo}`);


  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
