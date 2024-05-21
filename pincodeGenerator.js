class pincodeGenerator extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"});

        this.shadowRoot.innerHTML = `
        <input type="text" placeholder="Enter Pincode"/>
        <button type="submit" id="submitBtn">SUBMIT</button>
        <h1>Address</h1>
        <h3 id="data"></h3>
        `;
    }

    connectedCallback(){
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
        fetchedData.innerHTML = ''; 
        data[0].PostOffice.forEach((x) => {
            console.log(x.Name, "-", x.DeliveryStatus);
            fetchedData.innerHTML += `${x.Name} - ${x.DeliveryStatus}<br>`;
        });
    }
}

customElements.define("pincode-generator", pincodeGenerator);
