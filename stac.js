document.addEventListener('DOMContentLoaded', () => {
    const mainWrapper = document.getElementById('mainWrapper');
    const menuItems = document.querySelectorAll('.menu-item');
    const drinkSelect = document.getElementById('drinkType');
    const menuCard = document.getElementById('menuCard');

    const mainOrderForm = document.getElementById('mainOrderForm');
    const paymentSection = document.getElementById('paymentSection');
    const calculateBtn = document.getElementById('calculateBtn');
    const paymentForm = document.getElementById('paymentForm');

    const payMethodBtns = document.querySelectorAll('.pay-method-btn');
    const cashDetails = document.getElementById('cashDetails');
    const ewalletDetails = document.getElementById('ewalletDetails');

    const successBanner = document.getElementById('successBanner');
    const summaryCard = document.getElementById('summaryCard');
    const orderAgainBtn = document.getElementById('orderAgainBtn');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const printReceiptBtn = document.getElementById('printReceiptBtn');

    // GCash inputs
    const refNumberInput = document.getElementById('refNumber');
    const walletNumberInput = document.getElementById('walletNumber');
    const refError = document.getElementById('refError');

    // Cash change elements
    const cashAmountInput = document.getElementById('cashAmount');
    const changeDisplay = document.getElementById('changeDisplay');
    const cashError = document.getElementById('cashError');
    const sumCashTenderedRow = document.getElementById('sumCashTenderedRow');
    const sumCashTendered = document.getElementById('sumCashTendered');
    const sumChangeRow = document.getElementById('sumChangeRow');
    const sumChange = document.getElementById('sumChange');

    let selectedPrice = 140;
    let finalAmount = 140;

    // --- Clickable Menu Item Selection ---
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');

            const targetDrink = this.getAttribute('data-drink');
            selectedPrice = parseFloat(this.getAttribute('data-price')) || 140;
            if (drinkSelect) drinkSelect.value = targetDrink;
        });
    });

    // Sync dropdown change back to menu card highlight
    if (drinkSelect) {
        drinkSelect.addEventListener('change', function() {
            const selectedOpt = this.options[this.selectedIndex];
            const selectedVal = this.value;
            selectedPrice = parseFloat(selectedOpt.getAttribute('data-price')) || 140;

            menuItems.forEach(item => {
                if (item.getAttribute('data-drink') === selectedVal) {
                    menuItems.forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                }
            });
        });
    }

    // --- Handle Proceed to Payment ---
    if (mainOrderForm) {
        mainOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const sizeSelect = document.getElementById('drinkSize');
            const sugarSelect = document.getElementById('sugarLevel') ? document.getElementById('sugarLevel').value : '100%';
            const iceSelect = document.getElementById('iceLevel') ? document.getElementById('iceLevel').value : 'Normal Ice';
            const takeDineSelect = document.getElementById('TakeDine') ? document.getElementById('TakeDine').value : 'Dine in';
            
            const sizeName = sizeSelect ? sizeSelect.value : 'Regular';
            
            finalAmount = selectedPrice;
            if (sizeName === 'Large') { finalAmount += 30; }

            // Populate Summary Preview
            const sumDrink = document.getElementById('sumDrink');
            const sumDetails = document.getElementById('sumDetails');
            const sumTotal = document.getElementById('sumTotal');

            if (sumDrink && drinkSelect) sumDrink.textContent = drinkSelect.value;
            if (sumDetails) sumDetails.textContent = `${sizeName} | Sugar: ${sugarSelect} | Ice: ${iceSelect} | ${takeDineSelect}`;
            if (sumTotal) sumTotal.textContent = `₱${finalAmount}.00`;

            // HIDE MENU CARD WHEN PAYING
            if (menuCard) menuCard.style.display = 'none';

            // Reveal Payment Section
            if (calculateBtn) calculateBtn.style.display = 'none';
            mainOrderForm.querySelectorAll('select').forEach(sel => sel.disabled = true);
            if (paymentSection) {
                paymentSection.style.display = 'block';
            }
        });
    }

    // --- Payment Tab Switcher (Cash vs GCash/Maya) ---
    payMethodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            payMethodBtns.forEach(b => b.classList.remove('active'));
            if (cashDetails) cashDetails.classList.remove('active');
            if (ewalletDetails) ewalletDetails.classList.remove('active');

            this.classList.add('active');
            
            const method = this.getAttribute('data-method');
            if (method === 'cash') {
                if (cashDetails) cashDetails.classList.add('active');
            } else {
                if (ewalletDetails) ewalletDetails.classList.add('active');
            }
        });
    });

    // --- Dynamic Cash Change Calculation ---
    if (cashAmountInput) {
        cashAmountInput.addEventListener('input', function() {
            const tendered = parseFloat(this.value);
            if (isNaN(tendered) || tendered <= 0) {
                if (changeDisplay) changeDisplay.textContent = '₱0.00';
                if (cashError) cashError.style.display = 'none';
                return;
            }

            if (tendered >= finalAmount) {
                const change = tendered - finalAmount;
                if (changeDisplay) changeDisplay.textContent = `₱${change.toFixed(2)}`;
                if (cashError) cashError.style.display = 'none';
            } else {
                if (changeDisplay) changeDisplay.textContent = '₱0.00';
                if (cashError) {
                    cashError.textContent = `Insufficient cash. Total is ₱${finalAmount}.00`;
                    cashError.style.display = 'block';
                }
            }
        });
    }

    // --- Auto-Populate Mobile Number when 13-digit Reference Number is Valid ---
    if (refNumberInput && walletNumberInput) {
        refNumberInput.addEventListener('input', function() {
            const val = this.value.trim();
            if (/^\d{13}$/.test(val)) {
                walletNumberInput.value = "09171234567";
                if (refError) refError.style.display = 'none';
            } else {
                if (val.length > 0 && val.length < 13) {
                    if (refError) {
                        refError.textContent = "Reference number must be exactly 13 digits.";
                        refError.style.display = 'block';
                    }
                } else if (val.length === 0) {
                    if (refError) refError.style.display = 'none';
                    walletNumberInput.value = "";
                }
            }
        });
    }

    // --- Reset State Back to Menu ---
    function resetToDrinkSelection() {
        // RE-SHOW MENU CARD WHEN GOING BACK
        if (menuCard) menuCard.style.display = 'block';

        if (paymentSection) paymentSection.style.display = 'none';

        mainOrderForm.querySelectorAll('select').forEach(sel => sel.disabled = false);
        if (calculateBtn) calculateBtn.style.display = 'block';

        if (paymentForm) paymentForm.reset();
        if (refError) refError.style.display = 'none';
        if (cashError) cashError.style.display = 'none';
        if (changeDisplay) changeDisplay.textContent = '₱0.00';

        if (successBanner) successBanner.style.display = 'none';
        if (summaryCard) summaryCard.style.display = 'none';
    }

    if (backToMenuBtn) backToMenuBtn.addEventListener('click', resetToDrinkSelection);

    // --- Print Receipt Functionality ---
    if (printReceiptBtn) {
        printReceiptBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // --- Final Checkout with Database Save via XAMPP ---
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const activeMethodBtn = document.querySelector('.pay-method-btn.active');
            const currentMethod = activeMethodBtn ? activeMethodBtn.getAttribute('data-method') : 'cash';

            if (currentMethod === 'cash') {
                const tendered = parseFloat(cashAmountInput ? cashAmountInput.value : 0);
                if (isNaN(tendered) || tendered < finalAmount) {
                    if (cashError) {
                        cashError.textContent = `Please provide enough cash (Minimum: ₱${finalAmount}.00)`;
                        cashError.style.display = 'block';
                    }
                    if (cashAmountInput) cashAmountInput.focus();
                    return;
                }

                if (sumCashTenderedRow && sumCashTendered) {
                    sumCashTendered.textContent = `₱${tendered.toFixed(2)}`;
                    sumCashTenderedRow.style.display = 'flex';
                }
                if (sumChangeRow && sumChange) {
                    sumChange.textContent = `₱${(tendered - finalAmount).toFixed(2)}`;
                    sumChangeRow.style.display = 'flex';
                }
            } else {
                const refVal = refNumberInput ? refNumberInput.value.trim() : '';
                if (!/^\d{13}$/.test(refVal)) {
                    if (refError) {
                        refError.textContent = "Please enter a valid 13-digit GCash/Maya reference number.";
                        refError.style.display = 'block';
                    }
                    if (refNumberInput) refNumberInput.focus();
                    return;
                }
                if (sumCashTenderedRow) sumCashTenderedRow.style.display = 'none';
                if (sumChangeRow) sumChangeRow.style.display = 'none';
            }

            // Prepare order payload matching database schema
            const orderData = {
                drink_name: document.getElementById('drinkType').value,
                size: document.getElementById('drinkSize').value,
                sugar_level: document.getElementById('sugarLevel').value,
                ice_level: document.getElementById('iceLevel').value,
                order_type: document.getElementById('TakeDine').value,
                payment_method: currentMethod,
                amount_paid: finalAmount,
                reference_number: currentMethod === 'gcash' ? refNumberInput.value : null
            };

            // Send payload to PHP script in XAMPP
            fetch('save_order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Database server response:', data);
            })
            .catch(error => {
                console.error('Error saving order to database:', error);
            });

            // Hide payment form and reveal success banner
            if (paymentSection) paymentSection.style.display = 'none';
            if (successBanner) successBanner.style.display = 'block';
            if (summaryCard) summaryCard.style.display = 'block';
        });
    }

    if (orderAgainBtn) {
        orderAgainBtn.addEventListener('click', function() {
            resetToDrinkSelection();
            if (mainOrderForm) mainOrderForm.reset();
        });
    }
});