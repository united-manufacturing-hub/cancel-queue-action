const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const token = core.getInput('github-token');
        const octokit = github.getOctokit(token);
        const { context } = github;
        const branch = context.ref.replace('refs/heads/', '');

        // Get all workflow runs for the current branch that are pending
        const { data: { workflow_runs: branch_runs } } = await octokit.rest.actions.listWorkflowRunsForRepo({
            owner: context.repo.owner,
            repo: context.repo.repo,
            status: 'queued'
        });

        console.log(branch_runs);

        // Cancel them
        for (const run of branch_runs) {
            await octokit.rest.actions.cancelWorkflowRun({
                owner: context.repo.owner,
                repo: context.repo.repo,
                run_id: run.id
            });
        }

    } catch (error) {
        core.setFailed(`Action failed with error: ${error}`);
    }
}

run();
