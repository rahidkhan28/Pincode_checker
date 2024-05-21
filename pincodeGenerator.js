class pincodeGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="style.css">

        <div class="container">
            <div>
                <input type="text" placeholder="Enter Pincode"/>
                <button type="submit" id="submitBtn">SUBMIT</button>
            </div>
            <h1></h1>
            <table id="data"></table>
        </div>
        `;
    }

    connectedCallback() {
        const submitBtn = this.shadowRoot.getElementById("submitBtn");
        submitBtn.addEventListener("click", this.handleSubmit.bind(this));
    }

    async handleSubmit() {
        const pincodeInput = this.shadowRoot.querySelector("input[type='text']");
        const pincode = pincodeInput.value.trim();

        if (!pincode) {
            alert("Please enter a pincode.");
            return;
        }

        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        if (!response.ok) {
            alert("Failed to fetch data.");
            return;
        }

        const data = await response.json();
        let fetchedData = this.shadowRoot.getElementById("data");
        let text = this.shadowRoot.querySelector("h1");
        fetchedData.innerHTML = ''; 

        if (data[0].Status !== "Success") {
            alert("Invalid Pincode.");
            return;
        }

        text.innerHTML = "Address";

        const tableHeader = `
            <tr>
                <th>Name</th>
                <th>Delivery Status</th>
            </tr>
        `;
        fetchedData.innerHTML = tableHeader;

        data[0].PostOffice.forEach((x) => {
            const tableRow = `
                <tr>
                    <td>${x.Name}</td>
                    <td>${x.DeliveryStatus}</td>
                </tr>
            `;
            fetchedData.innerHTML += tableRow;
        });
    }
}

customElements.define("pincode-generator", pincodeGenerator);
