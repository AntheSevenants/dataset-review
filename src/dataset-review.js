class DatasetReview {
    constructor() {
        d3.select("#input_dataset").on("change", (event) => {
            let reader = new FileReader()
            reader.onload = () => {
                d3.csv(reader.result, d3.autoType).then((dataset) => {
                    this.load(dataset);
                });
            }
            reader.readAsDataURL(event.target.files[0])
        });
    }

    load(dataset) {
        this.dataset = dataset;

        this.currentIndex = 0;
        this.maxIndex = dataset.length;

        let landingCard = d3.select("#landing_card");
        landingCard.classed("animate__animated animate__bounceOut animate__faster", true);

        let reviewCard = d3.select("#review_card");

        setTimeout(() => {
            landingCard.attr("class", "d-none");

            reviewCard.classed("d-none", false);
            reviewCard.classed("animate__animated animate__bounceIn animate__faster", true);

            window.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "ArrowLeft":
                    case "ArrowUp":
                    case "j":
                    case "f":
                        this.cycleRecord("down");
                        break;
                    case "ArrowRight":
                    case "ArrowDown":
                    case " ":
                    case "k":
                    case "e":
                        if (event.key == " " && event.shiftKey) {
                            this.cycleRecord("down");
                            break;
                        }

                        this.cycleRecord("up");
                        break;
                }
            });

            window.addEventListener("wheel", event => {
                const delta = Math.sign(event.deltaY);
                if (delta > 0) {
                    this.cycleRecord("up");
                } else {
                    this.cycleRecord("down");
                }
            });
        }, 500);

        this.showRecord(this.currentIndex);
    }

    cycleRecord(action) {
        let index;
        if (action == "up") {
            index = this.currentIndex + 1;
        } else if (action == "down") {
            index = this.currentIndex - 1;
        } else {
            console.log("What action is this?", action);
        }

        if (index < 0 || index >= this.maxIndex) {
            return;
        }

        this.showRecord(index);
    }

    showRecord(index) {
        this.currentIndex = index;

        let reviewCardBody = d3.select("#review_card_body");

        let currentIndex = d3.select("#current_index");
        currentIndex.node().value = index + 1;
        currentIndex.node().min = 1;
        currentIndex.node().max = this.maxIndex;
        currentIndex.node().style.width = (2 + index.toString().length) + "ch";
        currentIndex.on("input", (event) => {
            this.showRecord(parseInt(event.target.value) - 1);
        });

        d3.select("#max_index").html(this.maxIndex);

        let tableDiv = d3.select("#table");
        tableDiv.html("");

        if (this.dataset.columns.length >= 2) {
            this.createTransposedTable(tableDiv, index);
        } else {
            this.createRegularTable(tableDiv, index);
        }
    }

    createTransposedTable(tableDiv, index) {
        let data = this.dataset.columns.map((column) => [column, this.dataset[index][column]]);

        let table = tableDiv.append('table');

        // create a row for each object in the data
        let rows = table.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        let cells = rows.selectAll("td")
            .data((row) => [...Array(data[0].length).keys()].map((column, index) => ({ value: row[index] })))
            .enter()
            .append("td")
            .style("font-weight", (d, index) => index == 0 ? "bold" : "normal")
            .classed("pe-4", (d, index) => index == 0)
            .classed("monospace", (d, index) => index != 0)
            .html(d => d.value);
    }

    createRegularTable(tableDiv, index) {
        let table = tableDiv.append('table');
        table.classed("text-center", "true");
        table.classed("w-100", true);

        let thead = table.append('thead')
        let tbody = table.append('tbody');

        // Append the header row
        thead.append('tr')
            .selectAll('th')
            .data(this.dataset.columns).enter()
            .append('th')
            .text(column => column);

        // Create a row for each object in the data
        let rows = tbody.selectAll('tr')
            .data(this.dataset.slice(index, index + 1))
            .enter()
            .append('tr');

        // Create a cell in each row for each column
        let cells = rows.selectAll('td')
            .data(row => this.dataset.columns.map((column) => ({ column: column, value: row[column] })))
            .enter()
            .append('td')
            .classed("monospace", true)
            .text((d) => d.value);
    }
}
