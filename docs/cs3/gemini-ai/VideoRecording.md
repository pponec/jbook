# Automatické scrolování obrazovky:

Chrome -> F15 -> Console -> Clear All -> Insert JS

```javascript
function scrollVsechno() {
    // Najde všechny prvky na stránce (divy), které jsou vyšší než obrazovka (mají posuvník)
    var elements = document.querySelectorAll('*');
    
    elements.forEach(function(el) {
        // Pokud má prvek obsah k posouvání
        if (el.scrollHeight > el.clientHeight) {
             el.scrollBy(0, 1); // Posune ho o 1 pixel
        }
    });

    // Zopakuje akci za 20 milisekund (rychlost měňte zde)
    setTimeout(scrollVsechno, 20);
}

scrollVsechno();
```

Plus nahrát obrazovku v OSB