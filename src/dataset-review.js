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
        }, 500);

        this.showRecord(this.currentIndex);
    }

    // https://gist.github.com/jfreels/6734025
    showRecord(index) {
        this.currentIndex = index;

        let reviewCardBody = d3.select("#review_card_body");
        let tableDiv = d3.select("#table");

        let currentIndex = d3.select("#current_index");
        currentIndex.node().value = index + 1;
        currentIndex.node().min = index + 1;
        currentIndex.node().max = this.maxIndex;
        currentIndex.node().style.width = "3ch";
        currentIndex.on("input", (event) => {
            event.target.style.width = 2 + event.target.value.length + "ch";
            this.showRecord(parseInt(event.target.value) - 1);
        });

        d3.select("#max_index").html(this.maxIndex);

        tableDiv.html("");

        let table = tableDiv.append('table')
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
            .text((d) => d.value);
    }
}