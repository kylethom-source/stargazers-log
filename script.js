fetch("events.json")
    .then((response) => response.json())
    .then((events) => {
        const list = document.querySelector("#starred");

        events.forEach((event) => {
            const item = document.createElement("li");
            const link = document.createElement("a");

            link.href = event.url || `https://github.com/${event.name}`;
            link.target = "_blank";
            link.rel = "noreferrer";
            link.textContent = event.name;
            item.appendChild(link);
            list.appendChild(item);
        });
    })
    .catch((error) => {
        console.error("Unable to load starred repositories:", error);
    });
