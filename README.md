# Invite Me

GitHub Actions tool for making wide-spread collaboration easier. Built for https://githubhackathon.com/.

## Usage

**Users can comment on an issue to automatically get invited to be a collaborator!**

They must begin their comment with this exact string:

```
inviteme!
```

The action will be triggered for each issue comment, but will only succeed and invite the commenter if that precise syntax is used.

## Using this Workflow

### Personal Repositories

There are two things you need to do to correctly enable this action for your repository:

1. Create a [workflow file](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow) in your repository under the `.github/workflows` directory. There is an example available [in this repository](./.github/workflows/invitations.yml).
2. Add a personal access token to your repository. Follow [these instructions](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) to create a new token. When you add it to your repository, name it `INVITE_COLLABORATORS`, or any other name you choose, but ensure that it matches the name in your `invite.yml` file.

### Organization Repositories

More information coming soon!

### Optional (but recommended) steps

Set up [branch protection policies](https://help.github.com/en/github/administering-a-repository/about-protected-branches) for branches you don't want to allow push access to. The author strongly recommends protecting `master`/`mainline` and `gh-pages` branches by default.

## Future Work

* Allow users to mention other users to request an invitation for
* Enable collaboration access for organization teams
* Specify collaborator permissions for organization repositories
* Support for approval mechanisms by repository administrators
