var app = new Vue({
    el: "article",
    data: {
        products: [
            { 
            id: 1, 
            title: "TAG 1000 (TAG 950)", 
            short_text: 'Citrus Navel Orange Sanguigno  ', 
            image: 'img/imgonline-com-ua-Resize-lhx1D7DNr0j3Z.jpg',
            char: "<b>Resistance</b> <br>HR: Citrus canker, Citrus tristeza virus (CTV), Phytophthora, Greasy spot <br> IR: Citrus nematode, Alternaria brown spot, Citrus root rot",
            plant: "<li><span>Robust growth with dense foliage, offering excellent protection to fruits.</span></li><li><span>Highly prolific, ensuring abundant fruit set.</span></li><li><span>Early-maturing variety.</span></li>",
            fruit: "<li><span>Exceptional shelf life both on the tree and post-harvest.</span></li><li><span>Bright, vibrant orange hue with a distinctive navel formation.</span></li><li><span>Typically large-sized fruits ranging from 200 to 300 grams.</span></li>",
            cycle: "<li><span>Winter</span></li><li><span>Spring</span></li>",
            color: "Orange"
        },
            {
            id: 2, 
            title: "TAG 1000 (TAG 753)", 
            short_text: 'Sinensis Sanguineum Pernambuco', 
            image: 'img/imgonline-com-ua-Resize-3sGIZ5a9sQQvc.jpg', 
            char: "<b>Resistance</b> <br>HR: Citrus greening (HLB), Citrus tristeza virus (CTV), Phytophthora <br> IR: Citrus nematode, Alternaria brown spot, Citrus root rot",
            plant: "<li><span>Robust growth habit with a well-branched structure.</span></li><li><span>Consistent high yields with reliable fruit setting.</span></li><li><span>Early to mid-season variety.</span></li>",
            fruit: "<li><span>Excellent keeping quality on the tree and post-harvest.</span></li><li><span>Rich, deep red coloration with a glossy appearance.</span></li><li><span>Medium-sized fruits typically weighing 150 to 200 grams.</span></li>",
            cycle: "<li><span>Winter</span></li><li><span>Spring</span></li>",
            color: "Red"
        },
            {
            id: 3, 
            title: "TAG 1000 (TAG 878)", 
            short_text: 'Sinensis Sanguinello Moscato Nucellare', 
            image: 'img/imgonline-com-ua-Resize-xlnZ6Bsa10.jpg', 
            char: "<b>Resistance</b> <br>HR: Citrus canker, Citrus tristeza virus (CTV), Phytophthora <br> IR: Citrus nematode, Alternaria brown spot, Citrus root rot",
            plant: "<li><span>Vigorous growth habit with good canopy coverage.</span></li><li><span>Consistently high yields with dependable fruit set.</span></li><li><span>Mid to late-season variety.</span></li>",
            fruit: "<li><span>Long-lasting shelf life both on the tree and post-harvest.</span></li><li><span>Distinctive deep red coloration with a sweet, aromatic flavor.</span></li><li><span>Moderate-sized fruits typically weighing 120 to 180 grams.</span></li>",
            cycle: "<li><span>Spring</span></li><li><span>Summer</span></li>",
            color: "Red"
        },
            { 
            id: 4, 
            title: "TAG 1000 (TAG 933)", 
            short_text: 'Sinensis Cara Cara Navel', 
            image: 'img/imgonline-com-ua-Resize-U9yPNdNR0x.jpg', 
            char: "<b>Resistance</b> <br>HR: Citrus canker, Citrus tristeza virus (CTV), Phytophthora <br> IR: Citrus nematode, Alternaria brown spot, Citrus root rot",
            plant: "<li><span>Strong, vigorous growth with lush foliage.</span></li><li><span>Reliably high yields with excellent fruit set.</span></li><li><span>Mid to late-season variety.</span></li>",
            fruit: "<li><span>Extended shelf life on the tree and post-harvest.</span></li><li><span>Unique pinkish-red flesh with a sweet, tangy flavor.</span></li><li><span>Medium to large-sized fruits averaging 180 to 250 grams.</span></li>",
            cycle: "<li><span>Spring</span></li><li><span>Summer</span></li>",
            color: "Red/pink"
        },
            { 
            id: 5, 
            title: "TAG 1000 (TAG 912)", 
            short_text: 'Citrus Sinensis Valencia Tardivo  ', 
            image: 'img/imgonline-com-ua-Resize-Er9hyHIWez.jpg', 
            char: "<b>Resistance</b> <br>HR: Citrus canker, Citrus tristeza virus (CTV), Phytophthora <br> IR: Citrus nematode, Alternaria brown spot, Citrus root rot",
            plant: "<li><span>Robust growth with ample foliage cover.</span></li><li><span>Consistent high yields with reliable fruit setting.</span></li><li><span>Late-season variety.</span></li>",
            fruit: "<li><span>Excellent keeping quality on the tree and post-harvest.</span></li><li><span>Bright orange color with a balanced sweet-tart flavor.</span></li><li><span>Medium to large-sized fruits typically weighing 150 to 200 grams.</span></li>",
            cycle: "<li><span>Spring</span></li><li><span>Summer</span></li>",
            color: "Orange" 
        }
        ],
        product: {},
        btnVisible: 0,
        cart: {},
        contactFields: {
            name: '',
            companyName: '',
            position: '',
            city: '',
            country: '',
            telephone: '',
            email: '',
            userType: 'seed producer',
            otherType: '',
            interest: ''
        },
        orderInfo: {
            name: '',
            companyName: '',
            position: '',
            city: '',
            country: '',
            telephone: '',
            email: '',
            userType: 'seed producer',
            otherType: '',
            interest: ''
        },
        showOrderInfo: false,
        showTableHeaders: true
    },
    mounted: function() {
        this.getProduct();
        this.getCart();
        this.checkInCart();
    },
    methods: {
        addItem: function(id) {
            window.localStorage.setItem('prod', id);
        },
        getProduct: function() {
            console.log(this.product)
            if(window.location.hash) {
                var id = window.location.hash.replace('#', '');
                if(this.products && this.products.length > 0) {
                    for(i in this.products) {
                        if(this.products[i] && this.products[i].id && id==this.products[i].id) this.product=this.products[i];
                    }
                }
            }
        },
        addToCart: function(id) {
            var cart = [];
            if(window.localStorage.getItem('cart')) {
                cart = window.localStorage.getItem('cart').split(',');
            }

            if(cart.indexOf(String(id))==-1) {
                cart.push(id);
                window.localStorage.setItem('cart', cart.join());
                this.btnVisible=1;
            }
        },

        checkInCart:function() {
            if(this.product && this.product.id && window.localStorage.getItem('cart').split(',').indexOf(String(this.product.id)) !=-1) this.btnVisible=1;
        },
        getCart: function() {
            var cartItems = localStorage.getItem('cart');
            if (cartItems) {
                var cartIds = cartItems.split(',');
                this.cart = this.products.filter(product => cartIds.includes(String(product.id)));
            }
        },
        removeFromCart: function(id) {
            this.cart = this.cart.filter(item => item.id !== id);
            var cartItems = localStorage.getItem('cart');
            if (cartItems) {
                var cartIds = cartItems.split(',').filter(itemId => itemId !== String(id));
                localStorage.setItem('cart', cartIds.join());
            }
        },
        makeOrder: function() {
            this.orderInfo = { ...this.contactFields };
            this.cart = [];
            localStorage.removeItem('cart');
            
            this.contactFields = {
                name: '',
                companyName: '',
                position: '',
                city: '',
                country: '',
                telephone: '',
                email: '',
                userType: 'seed producer',
                otherType: '',
                interest: ''
            };

            this.showOrderInfo = true;
            this.showTableHeaders = false;
        }
    }
});