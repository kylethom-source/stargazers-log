const list = document.querySelector("#starred");
// Replace this value with your GitHub username.
const GITHUB_USERNAME = "kylethom-source";
const FALLBACK_DATA_URL = "events.json";

function createRepositoryItem(repository) {
    const item = document.createElement("li");
    const link = document.createElement("a");

    link.href = repository.url || `https://github.com/${repository.name}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = repository.name;
    item.appendChild(link);
    return item;
}

async function fetchFallbackRepositories() {
    const response = await fetch(FALLBACK_DATA_URL);

    if (!response.ok) {
        throw new Error(`Could not load ${FALLBACK_DATA_URL} (${response.status})`);
    }

    return response.json();
}

async function fetchGithubRepositories() {
    const repositories = [];
    let page = 1;

    while (true) {
        const endpoint = new URL(
            `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/starred`
        );
        endpoint.searchParams.set("per_page", "100");
        endpoint.searchParams.set("page", page);

        const response = await fetch(endpoint, {
            headers: {
                Accept: "application/vnd.github+json"
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API request failed (${response.status})`);
        }

        const pageOfRepositories = await response.json();
        repositories.push(...pageOfRepositories.map((repository) => ({
            name: repository.full_name,
            description: repository.description,
            url: repository.html_url,
            starred: "on GitHub"
        })));

        if (pageOfRepositories.length < 100) {
            return repositories;
        }

        page += 1;
    }
}

async function displayStarredRepositories() {
    try {
        const repositories = GITHUB_USERNAME === "YOUR_GITHUB_USERNAME"
            ? await fetchFallbackRepositories()
            : await fetchGithubRepositories();
        list.replaceChildren(...repositories.map(createRepositoryItem));
    } catch (error) {
        const message = document.createElement("li");
        message.textContent = "The starred repositories could not be loaded.";
        list.replaceChildren(message);
        console.error(error);
    }
}

displayStarredRepositories();
