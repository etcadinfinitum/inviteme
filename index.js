const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        // create Octokit client
        const thisToken = core.getInput('INVITATION_TOKEN');
        const octokit = new github.GitHub(token: thisToken);
        // get comment
        const thisComment = github.context.payload['comment']['body'];
        if (comment.startsWith('inviteme!')) {
            /* begin core invitation logic */
            // TODO: add support for mentioning a different user
            // determine variable values
            let thisRepo = github.context.payload['repository']['name'];    // e.g. 'inviteme'
            let thisUsername = github.context.payload['comment']['user']['login'];  // e.g. 'etcadinfinitum'
            let thisOwner = github.context.payload['repository']['owner']['name'];
            let thisIssueNumber = github.context.payload['issue']['number'];
            let thisPermission = null;
            // get response for addCollaborator call
            const { data: addedCollaborator } = await octokit.repos.addCollaborator({
                owner: thisOwner,
                repo: thisRepo,
                username: thisUsername
            });
            // more variable values
            let thisInviteLink = addedCollaborator['html_url'];
            let thisBody = '@' + username + ' ' + invite_link;
            // comment on issue with invitation link for repo
            const { data: commentResponse } = await octokit.issues.createComment({
                owner: thisOwner,
                repo: thisRepo,
                issue_number: thisIssueNumber,
                body: thisBody,
            });
        } else {
            console.log('User comment is not an invitation request. Exiting.');
        }
    } catch (error) {
        console.log('ERROR: ' + error.message);
        core.setFailed(error.message);
    }
}

run()
