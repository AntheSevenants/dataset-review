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

    showRecord(index) {
        this.currentIndex = index;

        let reviewCardBody = d3.select("#review_card_body");
        let tableDiv = d3.select("#table");

        let currentIndex = d3.select("#current_index");
        currentIndex.node().value = index + 1;
        currentIndex.node().min = 1;
        currentIndex.node().max = this.maxIndex;
        currentIndex.node().style.width = (2 + index.toString().length) + "ch";
        currentIndex.on("input", (event) => {
            this.showRecord(parseInt(event.target.value) - 1);
        });

        d3.select("#max_index").html(this.maxIndex);

        let data = this.dataset.columns.map((column) => [column, this.dataset[index][column]]);

        tableDiv.html("");

        let table = tableDiv.append('table')

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
}