const core = require('@actions/core');
const github = require('@actions/github');
const compareVersions = require('compare-versions');

try {
  const token = core.getInput('repo-token');
  const draft = core.getInput('draft') === 'true' ? true : false;
  const versionPattern = /^v\d+\.\d+\.\d+/;
  if (!token) return;

  // Create the octokit client
  const octokit = new github.GitHub(token);
  const nwo = process.env['GITHUB_REPOSITORY'] || '/';
  const [owner, repo] = nwo.split('/');

  const createPayload = github.context.payload;
  // console.log(JSON.stringify(github.context.payload, undefined, 2));
  if (createPayload.ref_type === 'tag' && versionPattern.test(createPayload.ref)) {
    const tag = createPayload.ref;
    console.log(`Created the tag (${tag}) on ${nwo}`);

    octokit.repos.getReleaseByTag({ owner, repo, tag }).then(function() {
      console.log(`Release found! Not continuing.`);
    }).catch(function(error) {
      if (error.status === 404) {
        console.log(`Release for ${tag} not found!`);
        octokit.repos.listTags({ owner, repo }).then(function(tags){
          // arr.filter(v => /^v\d+\.\d+\.\d+/.test(v));
          const sortedVersionedTags = tags.data.filter(
            version => /^v\d+\.\d+\.\d+/.test(version.name)
          ).map(v => v.name).sort(compareVersions);

          console.log('All tags:');
          console.log(tags.data.map(t => t.name));
          console.log('Versioned tags (sorted):');
          console.log(sortedVersionedTags);

          const versionIndex = sortedVersionedTags.indexOf(tag);
          if (versionIndex === 0) {
            console.log(`${tag} is the first semantic versioned tag. Not continuing.`);
          } else {
            const previousVersion = sortedVersionedTags[versionIndex - 1];
            const compareLink = `https://github.com/${nwo}/compare/${previousVersion}...${tag}`
            console.log(`Previous versioned tag is ${previousVersion}`);
            console.log(`Creating a release with for ${tag} with the compare link: ${compareLink}`);

            octokit.repos.createRelease({
              owner,
              repo,
              name: tag,
              tag_name: tag,
              draft: draft,
              body: compareLink
            }).then(function(release) {
              console.log('Release created!');
              console.log(release);
            }).catch(function(error) {
              console.log(`Creating release for ${tag} failed!`);
              console.log(error);
              core.setFailed(error.message);
            });
          }
        }).catch(function(error) {
          console.log(`Listing tags failed for ${nwo}`);
          console.log(error);
          core.setFailed(error.message);
        });
      }
    });
  } else {
    console.log(`${createPayload.ref} is not a semantically versioned tag. Not continuing.`);
  }

} catch (error) {
  core.setFailed(error.message);
}
