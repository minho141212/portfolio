(function () {
    const grid = document.getElementById('project-grid');
    const bar = document.getElementById('project-filterbar');
    if (!grid || !bar) return;

    const norm = s => (s || '').toString().trim().toLowerCase();

    const cards = Array.from(grid.querySelectorAll('.card'));
    const tagSet = new Set();

    cards.forEach(card => {
        const tagEls = card.querySelectorAll('.tags li');
        const tags = Array.from(tagEls).map(li => norm(li.textContent)).filter(Boolean);
        card.__tags = tags;
        tags.forEach(t => tagSet.add(t));
    });

    function makeBtn(label, value, pressed) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-btn';
        btn.textContent = label;
        btn.dataset.filter = value;
        btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
        btn.addEventListener('click', () => applyFilter(value, true));
        return btn;
    }

    const tagCounts = {};
    cards.forEach(c => (c.__tags || []).forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));

    const allBtn = makeBtn(`All (${cards.length})`, 'all', true);
    bar.appendChild(allBtn);

    Array.from(tagSet).sort().forEach(t => {
        const label = t.replace(/\b\w/g, m => m.toUpperCase());
        const count = tagCounts[t] || 0;
        bar.appendChild(makeBtn(`${label} (${count})`, t, false));
    });

    function applyFilter(value, persist) {
        const target = norm(value);
        const isAll = !target || target === 'all';

        cards.forEach(card => {
            const has = isAll ? true : (card.__tags || []).includes(target);
            card.classList.toggle('is-hidden', !has);
        });

        const btns = bar.querySelectorAll('.filter-btn');
        btns.forEach(b => {
            const on = norm(b.dataset.filter) === (isAll ? 'all' : target);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });

        if (persist) {
            try { localStorage.setItem('projectFilter', isAll ? 'all' : target); } catch (e) {}
            const url = new URL(location.href);
            if (isAll) url.searchParams.delete('tag');
            else url.searchParams.set('tag', target);
            history.replaceState({}, '', url);
        }
    }

    const urlTag = norm(new URL(location.href).searchParams.get('tag'));
    const saved = norm(localStorage.getItem('projectFilter'));
    const initial = urlTag || saved || 'all';
    applyFilter(initial, false);
})();