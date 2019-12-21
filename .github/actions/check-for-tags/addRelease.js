const core = require('@actions/core');
const github = require('@actions/github');

try {
  const token = core.getInput('repo-token');
  if (!token) return;

  // Create the octokit client
  const octokit = new github.GitHub(token);
  const nwo = process.env['GITHUB_REPOSITORY'] || '/';
  const [owner, repo] = nwo.split('/');

  const createPayload = github.context.payload;
  console.log(JSON.stringify(github.context.payload, undefined, 2));
  if (createPayload.ref_type === 'tag') {
    const ref = createPayload.ref;
    console.log(`Created the tag (${ref}) on ${owner}/${repo}`);
    const releases = oktokit.releases;
    // release_for_tag
  }

} catch (error) {
  core.setFailed(error.message);
}
