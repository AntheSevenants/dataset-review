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
    }
}