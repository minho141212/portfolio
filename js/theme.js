(function(){
    var btn = document.getElementById('theme-toggle');

    function setTheme(mode) {
        document.documentElement.setAttribute('data-theme', mode);
        try { localStorage.setItem('theme', mode); } catch(e) {}
        renderLabel(mode);
    }

    function getTheme() {
        var attr = document.documentElement.getAttribute('data-theme');
        return (attr === 'dark') ? 'dark' : 'light';
    }

    function renderLabel(mode) {
        if (!btn) return;
        btn.textContent = (mode === 'dark') ? 'Light' : "Dark";
    }

    renderLabel(getTheme());

    if (btn) {
        btn.addEventListener('click', function() {
            var next = (getTheme() === 'dark') ? 'light' : 'dark';
            setTheme(next);
        });
    }
})();