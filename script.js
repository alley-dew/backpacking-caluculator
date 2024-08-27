document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('itemsContainer');
    const totalWeightElement = document.getElementById('totalWeight');
    const categoryWeightsElement = document.getElementById('categoryWeights');
    const addItemButton = document.getElementById('addItem');
    const calculateTotalButton = document.getElementById('calculateTotal');
    const addCategoryButton = document.getElementById('addCategory');
    const deleteCategoryButton = document.getElementById('deleteCategory');
    const newCategoryInput = document.getElementById('newCategory');
    const categoryList = document.getElementById('categoryList');

    let itemCount = 1;
    let categories = ['텐트', '침낭', '조리도구', '기타'];

    // Initialize category list
    function updateCategoryList() {
        categoryList.innerHTML = '';
        categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <input type="checkbox" value="${category}">
                ${category}
            `;
            listItem.addEventListener('click', (event) => {
                if (event.target.tagName === 'INPUT') {
                    // Checkbox click logic
                    event.target.parentElement.classList.toggle('selected', event.target.checked);
                }
            });
            categoryList.appendChild(listItem);
        });
    }

    // Add new item input fields
    addItemButton.addEventListener('click', () => {
        itemCount++;
        
        const newItemDiv = document.createElement('div');
        newItemDiv.className = 'item';
        newItemDiv.innerHTML = `
            <label for="item${itemCount}">장비 이름:</label>
            <input type="text" id="item${itemCount}" name="item${itemCount}" required>
            
            <label for="category${itemCount}">카테고리:</label>
            <select id="category${itemCount}" name="category${itemCount}" required>
                ${getCategoryOptions()}
            </select>
            
            <label for="weight${itemCount}">무게 (그램):</label>
            <input type="number" id="weight${itemCount}" name="weight${itemCount}" required>
            <button type="button" class="editItem">수정</button>
            <button type="button" class="deleteItem">삭제</button>
        `;

        itemsContainer.appendChild(newItemDiv);

        // Add event listeners for edit and delete buttons
        addEditAndDeleteFunctionality(newItemDiv);
    });

    // Calculate total weight and category-wise weights
    calculateTotalButton.addEventListener('click', () => {
        let submissionTotalWeight = 0;
        let categoryWeights = {};

        // Initialize category weights
        categories.forEach(category => {
            categoryWeights[category] = 0;
        });

        categoryWeightsElement.innerHTML = '';

        const items = document.querySelectorAll('.item');
        items.forEach(itemDiv => {
            const itemName = itemDiv.querySelector('input[type="text"]').value;
            const itemWeight = parseFloat(itemDiv.querySelector('input[type="number"]').value);
            const itemCategory = itemDiv.querySelector('select').value;

            if (itemName && !isNaN(itemWeight)) {
                submissionTotalWeight += itemWeight;
                categoryWeights[itemCategory] += itemWeight;
            }
        });

        totalWeightElement.textContent = submissionTotalWeight.toFixed(2);

        for (const [category, weight] of Object.entries(categoryWeights)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${category}: ${weight.toFixed(2)}그램`;
            categoryWeightsElement.appendChild(listItem);
        }
    });

    // Add functionality to edit and delete buttons
    function addEditAndDeleteFunctionality(itemDiv) {
        const editButton = itemDiv.querySelector('.editItem');
        const deleteButton = itemDiv.querySelector('.deleteItem');

        // Edit button functionality
        editButton.addEventListener('click', () => {
            const inputs = itemDiv.querySelectorAll('input, select');
            inputs.forEach(input => input.disabled = !input.disabled);
            editButton.textContent = inputs[0].disabled ? '수정' : '저장';
        });

        // Delete button functionality
        deleteButton.addEventListener('click', () => {
            itemsContainer.removeChild(itemDiv);
        });
    }

    // Add category functionality
    addCategoryButton.addEventListener('click', () => {
        const newCategory = newCategoryInput.value.trim();

        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            updateCategoryList();
            newCategoryInput.value = ''; // Clear input field
        }
    });

    // Delete category functionality
    deleteCategoryButton.addEventListener('click', () => {
        const selectedCheckboxes = categoryList.querySelectorAll('input[type="checkbox"]:checked');

        selectedCheckboxes.forEach(checkbox => {
            const category = checkbox.value;
            categories = categories.filter(cat => cat !== category);

            // Remove category from item selects
            document.querySelectorAll('select[name^="category"]').forEach(select => {
                const optionToRemove = select.querySelector(`option[value="${category}"]`);
                if (optionToRemove) {
                    optionToRemove.remove();
                }
            });
        });

        updateCategoryList();
    });

    // Get the current category options as a string of HTML
    function getCategoryOptions() {
        return categories.map(category => `<option value="${category}">${category}</option>`).join('');
    }

    // Initialize the category list
    updateCategoryList();

    // Add initial event listeners for the first item
    addEditAndDeleteFunctionality(document.querySelector('.item'));
});
