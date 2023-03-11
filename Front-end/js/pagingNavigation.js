function createPagination(totalPages, currentPage = 1) {
    debugger
    const paginationContainer = document.querySelector('.navigation');
    const maxPagesToShow = 5;

    // Create previous button
    const prevBtn = document.createElement('i');
    prevBtn.classList.add('fa-solid', 'fa-chevron-left', 'control-page', 'navigation-page-btn')
    prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        createPagination(totalPages, currentPage);
    }
    });

    // Create next button
    const nextBtn = document.createElement('i');
    nextBtn.classList.add('fa-solid', 'fa-chevron-right', 'control-page', 'navigation-page-btn')
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            createPagination(totalPages, currentPage);
        }
    });

    // Create first button
    const firstBtn = document.createElement('i');
    firstBtn.classList.add('fa-solid', 'fa-angles-left', 'control-page', 'navigation-page-btn')
    firstBtn.addEventListener('click', () => {
        if (currentPage !== 1) {
            currentPage = 1;
            createPagination(totalPages, currentPage);
        }
    });

    // Create last button
    const lastBtn = document.createElement('i');
    lastBtn.classList.add('fa-solid', 'fa-angles-right', 'control-page', 'navigation-page-btn')
    lastBtn.addEventListener('click', () => {
        if (currentPage !== totalPages) {
            currentPage = totalPages;
            createPagination(totalPages, currentPage);
        }
    });

    // Clear container before appending children
    paginationContainer.innerHTML = '';

    // Append first button
    paginationContainer.appendChild(firstBtn);

    // If current page is greater than max pages to show, show "..."
    if (currentPage > maxPagesToShow) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('navigation-page-number', 'navigation-page-btn')
        pageBtn.innerText = '1';
        pageBtn.addEventListener('click', () => {
            currentPage = 1;
            createPagination(totalPages, currentPage);
        });
        paginationContainer.appendChild(pageBtn);

        const dots = document.createElement('span');
        dots.classList.add('space-page-btn')
        dots.innerText = '...';
        paginationContainer.appendChild(dots);
    }

    // Create page buttons
    const pagesToShow = Math.min(totalPages, maxPagesToShow);
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = currentPage - halfMaxPages;
    if (startPage + maxPagesToShow > totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
    }

    if (startPage < 1) {
        startPage = 1;
    }

    for (let i = startPage; i < startPage + pagesToShow; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('navigation-page-number', 'navigation-page-btn')
        pageBtn.innerText = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            createPagination(totalPages, currentPage);
        });

        if (i === currentPage) {
            pageBtn.classList.add('current-page');
        }

        paginationContainer.appendChild(pageBtn);
    }

    // If current page is less than total pages minus max pages to show, show "..."
    if (currentPage < totalPages - halfMaxPages) {
        const dots = document.createElement('span');
        dots.classList.add('space-page-btn')
        dots.innerText = '...';
        paginationContainer.appendChild(dots);

        const pageBtn = document.createElement('button');
        pageBtn.classList.add('navigation-page-number', 'navigation-page-btn')
        pageBtn.innerText = totalPages;
        pageBtn.addEventListener('click', () => {
            currentPage = totalPages;
            createPagination(totalPages, currentPage);
        });
        paginationContainer.appendChild(pageBtn);
    }

    // Append last button
    paginationContainer.appendChild(lastBtn);

    // Append previous button
    paginationContainer.insertBefore(prevBtn, paginationContainer.firstChild);

    // Append next button
    paginationContainer.appendChild(nextBtn);
}