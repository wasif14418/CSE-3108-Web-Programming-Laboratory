# Pokémon Card Search

## Endpoint used
`GET https://pokeapi.co/api/v2/pokemon/{name}`

The `{name}` is whatever the user types (or a quick-search button value),
lowercased and trimmed before it's inserted into the URL.

## Fields used from the response
- `id` — shown as the card's Pokédex number
- `name` — shown as the card title
- `sprites.other["official-artwork"].front_default` (falls back to
  `sprites.front_default`) — the artwork image
- `types[].type.name` — used both to label the card and to pick its
  background color/theme
- `height` and `weight` — converted from the API's decimetres/hectograms
  into metres/kilograms
- `stats[].stat.name` and `stats[].base_stat` — the six base stats, drawn
  as labeled bars
- `abilities[].ability.name` — the first two abilities are shown as badges

## Files
- `index.html` — page structure and form
- `style.css` — layout and the per-type card color themes
- `script.js` — fetch logic, loading/error/success states, and rendering


# AI Help
- Claude: https://claude.ai/share/b870c90b-d003-47dd-98be-c5d8a2302c87