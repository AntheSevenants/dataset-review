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

        let landingCard = d3.select("#landing_card");
        landingCard.classed("animate__animated animate__bounceOut animate__faster", true);

        setTimeout(() => { landingCard.attr("class", "d-none"); }, 500);
    }
}