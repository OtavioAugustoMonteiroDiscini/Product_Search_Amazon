document.getElementById('scrape-button').addEventListener('click', () => {
    const keyword = document.getElementById('keyword').value;
    if (!keyword) {
        alert('Please enter a keyword');
        return;
    }

    fetch(`/api/scrape?keyword=${keyword}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                const img = document.createElement('img');
                img.src = product.imageUrl;
                productDiv.appendChild(img);

                const title = document.createElement('h2');
                title.textContent = product.title;
                productDiv.appendChild(title);

                const rating = document.createElement('p');
                rating.textContent = `Rating: ${product.rating}`;
                productDiv.appendChild(rating);

                const reviews = document.createElement('p');
                reviews.textContent = `Reviews: ${product.reviews}`;
                productDiv.appendChild(reviews);

                resultsDiv.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
});
