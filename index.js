const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
    auth: core.getInput('INVITATION_TOKEN'),
    userAgent: 'inviteme v1.0',
    // omitting TimeZone: https://developer.github.com/v3/#using-the-last-known-timezone-for-the-user
});

async function createComment(owner, repo, issue_number, body) {
    const { data: commentResponse } = await octokit.issues.createComment({
        owner,
        repo,
        issue_number,
        body,
    });
}

async function addCollaborator(owner, repo, username, permission) {
    if (permission) {
        const { data: addedCollaborator } = await octokit.repos.addCollaborator({
            owner,
            repo,
            username,
            permission,
        });
        return addedCollaborator;
    } else {
        const { data: addedCollaborator } = await octokit.repos.addCollaborator({
            owner,
            repo,
            username
        });
        return addedCollaborator;
    }
}

try {
    const token = core.getInput('INVITATION_TOKEN');
    const comment = github.context.payload['comment']['body'];
    if (comment.startsWith('inviteme!')) {
        /* begin core invitation logic */
        // TODO: add support for mentioning a different user
        // determine variable values
        let repo = github.context.payload['repository']['name'];    // e.g. 'inviteme'
        let username = github.context.payload['comment']['user']['login'];  // e.g. 'etcadinfinitum'
        let owner = github.context.payload['repository']['owner']['name'];
        let issue_number = github.context.payload['issue']['number'];
        let permission = null;
        // get response for addCollaborator call
        let addedCollaborator = addCollaborator(owner, repo, username, permission);
        // more variable values
        let invite_link = addedCollaborator['html_url'];
        let body = '@' + username + ' ' + invite_link;
        // comment on issue with invitation link for repo
        let commentResponse = createComment(owner, repo, issue_number, body);
    } else {
        console.log('User comment is not an invitation request. Exiting.');
    }
} catch (error) {
    console.log('ERROR: ' + error.message);
    core.setFailed(error.message);
}
