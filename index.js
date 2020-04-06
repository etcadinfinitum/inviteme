const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        // create Octokit client
        const thisToken = process.env.INVITATION_TOKEN;
        if (!thisToken) {
            console.log('ERROR: Token was not retrieved correctly and is falsy.');
            core.setFailed('Error: token was not correctly interpreted');
        }
        const octokit = new github.GitHub(thisToken);
        // get comment
        const thisComment = github.context.payload['comment']['body'];
        const thisCommentLower = thisComment.toLowerCase();
        if (thisCommentLower.startsWith('inviteme') || thisCommentLower.startsWith('invite me')) {
            /* begin core invitation logic */
            // TODO: add support for mentioning a different user
            // determine variable values
            let thisRepo = github.context.payload['repository']['name'];    // e.g. 'inviteme'
            let thisUsername = github.context.payload['comment']['user']['login'];  // e.g. 'etcadinfinitum'
            let thisOwner = github.context.payload['repository']['owner']['login'];
            let thisIssueNumber = github.context.payload['issue']['number'];
            let thisPermission = null;
            console.log('Parsed event values:\n\tRepo: ' + thisRepo + '\n\tUsername of commenter: ' + 
                        thisUsername + '\n\tRepo Owner: ' + thisOwner + '\n\tIssue number: ' + thisIssueNumber);
            // get response for addCollaborator call
            const { data: addedCollaborator } = await octokit.repos.addCollaborator({
                owner: thisOwner,
                repo: thisRepo,
                username: thisUsername,
            });
            console.log(octokit);   // YOLO
            console.log(addedCollaborator);
            // more variable values
            let thisInviteLink = addedCollaborator['html_url'];
            let thisBody = '@' + thisUsername + ' ' + thisInviteLink;
            console.log('Parsed added collaborator values:\n\tInvite link: ' + thisInviteLink + 
                        '\n\tNew comment body: ' + thisBody);
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
        console.log('ERROR: ' + error.message + ' occurred at ' + error.fileName + ':' + error.lineNumber);
        core.setFailed(error.message);
    }
}

run()
