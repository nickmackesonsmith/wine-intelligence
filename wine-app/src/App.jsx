import { useState, useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";

// ─── Wine Varietal Database ─────────────────────────────────────────────────
const VARIETALS = [
  {
    id: "pinot-noir", name: "Pinot Noir", colour: "red",
    profile: { body: 4, acidity: 7, tannin: 4, sweetness: 1, fruit: 7, floral: 6, spice: 4, earth: 6, oak: 4, alcohol: 5, complexity: 8 },
    description: "Your desert island wine. Central Otago Pinot at its best — silky, perfumed, with dark cherry and earthy complexity. You've explored deeply (Chard Farm, Felton Road Block 3, Peregrine, Bald Hills) and your palate leans elegant over extracted.",
    tastingNotes: "Dark cherry, raspberry, violet, mushroom, thyme, silky tannins. The best Central Otago examples show a distinctive minerality — Central Otago schist terroir.",
    foodPairing: "Dark chocolate (your Guylian 54% pairing!), duck, mushroom risotto, salmon, lamb. Also BBQ with Rabbit Ranch.",
    regions: "Central Otago, Burgundy, Martinborough, Oregon, Sonoma Coast",
    recommendations: [
      { name: "Felton Road Bannockburn Pinot Noir", price: "$55", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=felton+road+pinot" },
      { name: "Burn Cottage Pinot Noir", price: "$55", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=burn+cottage+pinot" },
      { name: "Rippon Mature Vine Pinot Noir", price: "$50", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=rippon+pinot" },
      { name: "Quartz Reef Pinot Noir", price: "$40", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=quartz+reef+pinot" },
    ],
  },
  {
    id: "syrah", name: "Syrah / Shiraz", colour: "red",
    profile: { body: 7, acidity: 5, tannin: 6, sweetness: 1, fruit: 6, floral: 4, spice: 8, earth: 6, oak: 5, alcohol: 7, complexity: 8 },
    description: "Your power grape. Mudbrick verticals (2008→2024), Hawke's Bay Reserve Syrah, and Waiheke Shepherds Point — you've charted NZ Syrah from every angle. Northern Rhône beckons.",
    tastingNotes: "Black pepper, dark plum, olive, smoked meat, violets, leather. NZ Syrah sits between Rhône elegance and Barossa richness.",
    foodPairing: "Lamb (slow-cooked!), BBQ, venison, hard cheeses, dark chocolate. Your weekend meat wine.",
    regions: "Hawke's Bay, Waiheke Island, Northern Rhône, Barossa Valley",
    recommendations: [
      { name: "Trinity Hill Homage Syrah", price: "$70", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=trinity+hill+homage" },
      { name: "Craggy Range Le Sol Syrah", price: "$75", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=craggy+range+le+sol" },
      { name: "Guigal Crozes-Hermitage", price: "$35", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=guigal+crozes" },
      { name: "Chapoutier Saint-Joseph", price: "$40", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=chapoutier+saint+joseph" },
    ],
  },
  {
    id: "cabernet-sauvignon", name: "Cabernet Sauvignon", colour: "red",
    profile: { body: 8, acidity: 5, tannin: 8, sweetness: 1, fruit: 6, floral: 2, spice: 5, earth: 5, oak: 7, alcohol: 7, complexity: 7 },
    description: "The king grape — but you tend toward blends (Craggy Range Te Kahu, Mudbrick Velvet, Man O' War Dreadnought) rather than straight Cabernet.",
    tastingNotes: "Blackcurrant, cedar, tobacco, graphite, dark chocolate, eucalyptus. Serious tannins that reward patience.",
    foodPairing: "Prime steak, hard aged cheese, lamb rack, slow-braised short ribs.",
    regions: "Hawke's Bay, Waiheke Island, Bordeaux, Napa Valley, Coonawarra",
    recommendations: [
      { name: "Elephant Hill Airavata", price: "$60", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=elephant+hill+airavata" },
      { name: "Villa Maria Reserve Cabernet Merlot", price: "$30", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=villa+maria+reserve+cabernet" },
    ],
  },
  {
    id: "merlot", name: "Merlot", colour: "red",
    profile: { body: 6, acidity: 4, tannin: 5, sweetness: 1, fruit: 7, floral: 3, spice: 3, earth: 4, oak: 5, alcohol: 6, complexity: 5 },
    description: "Softer and plummier than Cabernet. Hawke's Bay makes brilliant Merlot. You know it through blends but try it solo.",
    tastingNotes: "Plum, dark cherry, chocolate, herbs, leather, velvet tannins.",
    foodPairing: "Roast lamb, pasta with red sauce, pizza, mushroom dishes. A great weeknight red.",
    regions: "Hawke's Bay, Waiheke Island, Bordeaux (Saint-Émilion, Pomerol)",
    recommendations: [
      { name: "Church Road Grand Reserve Merlot", price: "$30", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=church+road+merlot" },
      { name: "Te Mata Awatea Cabernet/Merlot", price: "$40", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=te+mata+awatea" },
    ],
  },
  {
    id: "gamay", name: "Gamay (Beaujolais)", colour: "red",
    profile: { body: 3, acidity: 7, tannin: 2, sweetness: 1, fruit: 8, floral: 5, spice: 3, earth: 4, oak: 1, alcohol: 4, complexity: 5 },
    description: "Summer in a glass — light, juicy, and perfect chilled. Cru Beaujolais (Morgon, Moulin-à-Vent, Fleurie) offers real complexity. Your Auckland summer red.",
    tastingNotes: "Cherry, raspberry, banana (carbonic), violet, pepper. Cru-level adds mineral, earthy depth.",
    foodPairing: "Charcuterie, pizza, BBQ chicken, picnic food, sushi.",
    regions: "Beaujolais (Morgon, Fleurie, Moulin-à-Vent), Loire Valley",
    recommendations: [
      { name: "Marcel Lapierre Morgon", price: "$40", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=lapierre+morgon" },
      { name: "Domaine des Terres Dorées Beaujolais", price: "$25", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=terres+dorees+beaujolais" },
    ],
  },
  {
    id: "chardonnay", name: "Chardonnay", colour: "white",
    profile: { body: 7, acidity: 5, tannin: 1, sweetness: 2, fruit: 6, floral: 3, spice: 3, earth: 4, oak: 7, alcohol: 6, complexity: 7 },
    description: "You love it rich and creamy — you literally wrote 'Buttery' on a Chard Farm J&J bottle. Kumeu River Maté's ($105) is your pinnacle.",
    tastingNotes: "Butter, toast, citrus, stone fruit, hazelnut, vanilla, brioche.",
    foodPairing: "Lobster, crayfish, creamy pasta, roast chicken, soft cheeses.",
    regions: "Kumeu, Gisborne, Central Otago, Burgundy (Meursault, Puligny)",
    recommendations: [
      { name: "Kumeu River Village Chardonnay", price: "$25", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=kumeu+river+village+chardonnay" },
      { name: "Odyssey Iliad Chardonnay", price: "$30", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=odyssey+iliad+chardonnay" },
      { name: "Chard Farm Judge & Jury Chardonnay", price: "$35", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=chard+farm+chardonnay" },
      { name: "Louis Jadot Meursault", price: "$65", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=jadot+meursault" },
    ],
  },
  {
    id: "sauvignon-blanc", name: "Sauvignon Blanc", colour: "white",
    profile: { body: 3, acidity: 8, tannin: 1, sweetness: 1, fruit: 7, floral: 4, spice: 2, earth: 4, oak: 1, alcohol: 5, complexity: 5 },
    description: "NZ's calling card — but you're rightly past the generic ones. The best (Te Koko, Greywacke, Dog Point Section 94) transcend the style.",
    tastingNotes: "Grapefruit, passionfruit, gooseberry, cut grass, bell pepper, flint.",
    foodPairing: "Goat cheese, green salads, sushi, shellfish, asparagus, Thai green curry.",
    regions: "Marlborough, Loire Valley (Sancerre, Pouilly-Fumé), Bordeaux",
    recommendations: [
      { name: "Cloudy Bay Te Koko", price: "$40", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=cloudy+bay+te+koko" },
      { name: "Greywacke Wild Sauvignon", price: "$35", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=greywacke+wild+sauvignon" },
      { name: "Dog Point Section 94", price: "$35", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=dog+point+section+94" },
    ],
  },
  {
    id: "riesling", name: "Riesling", colour: "white",
    profile: { body: 3, acidity: 9, tannin: 1, sweetness: 4, fruit: 7, floral: 7, spice: 3, earth: 5, oak: 0, alcohol: 3, complexity: 8 },
    description: "The greatest white grape on earth — fight me. Never oaked, always transparent to its site. From bone-dry to lusciously sweet, Riesling does it all.",
    tastingNotes: "Lime, green apple, white peach, jasmine, petrol (aged), slate, honey, ginger.",
    foodPairing: "Thai, Vietnamese, sushi, spicy food, pork, duck. The most food-versatile grape alive.",
    regions: "Alsace, Mosel, Clare Valley, Central Otago, Waipara, Wachau",
    recommendations: [
      { name: "Felton Road Riesling", price: "$30", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=felton+road+riesling" },
      { name: "Trimbach Riesling", price: "$30", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=trimbach+riesling" },
      { name: "Rippon Riesling", price: "$35", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=rippon+riesling" },
    ],
  },
  {
    id: "gewurztraminer", name: "Gewürztraminer", colour: "white",
    profile: { body: 6, acidity: 4, tannin: 1, sweetness: 5, fruit: 7, floral: 9, spice: 8, earth: 3, oak: 1, alcohol: 6, complexity: 6 },
    description: "The most perfumed wine grape — lychee, rose, Turkish delight, ginger. You already love this (Rippon, Matawhero, Vinoptima).",
    tastingNotes: "Lychee, rose petal, Turkish delight, ginger, cinnamon, mango, honey, white pepper.",
    foodPairing: "Thai, Indian, Moroccan, Chinese — any aromatic, spicy cuisine. This is your Auckland Asian food wine.",
    regions: "Alsace, Central Otago, Marlborough, Alto Adige",
    recommendations: [
      { name: "Zind-Humbrecht Gewürztraminer", price: "$40", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=zind+humbrecht+gewurztraminer" },
      { name: "Trimbach Gewürztraminer", price: "$35", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=trimbach+gewurztraminer" },
      { name: "Amisfield Gewürztraminer", price: "$28", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=amisfield+gewurztraminer" },
    ],
  },
  {
    id: "pinot-gris", name: "Pinot Gris / Pinot Grigio", colour: "white",
    profile: { body: 5, acidity: 5, tannin: 1, sweetness: 3, fruit: 6, floral: 4, spice: 3, earth: 3, oak: 2, alcohol: 5, complexity: 4 },
    description: "Two personalities: Italian Grigio is lean and crisp; Alsace/NZ Gris is richer. NZ versions sit beautifully in the middle.",
    tastingNotes: "Pear, apple, honey, almond, white flowers, quince.",
    foodPairing: "Seafood, chicken, salads, mild Thai, cream sauces.",
    regions: "Alsace, Central Otago, Marlborough, Alto Adige, Oregon",
    recommendations: [
      { name: "Mt Difficulty Pinot Gris", price: "$28", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=mt+difficulty+pinot+gris" },
      { name: "Rippon Pinot Gris", price: "$30", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=rippon+pinot+gris" },
    ],
  },
  {
    id: "viognier", name: "Viognier", colour: "white",
    profile: { body: 7, acidity: 3, tannin: 1, sweetness: 2, fruit: 7, floral: 8, spice: 4, earth: 3, oak: 4, alcohol: 7, complexity: 6 },
    description: "The Rhône's perfumed white — apricot, peach blossom, honeysuckle. Your Northern Rhône love means you need this.",
    tastingNotes: "Apricot, peach, honeysuckle, orange blossom, musk, ginger.",
    foodPairing: "Lobster, crayfish, creamy Thai curries, roast pork, rich fish.",
    regions: "Condrieu, Northern Rhône, Hawke's Bay, Languedoc",
    recommendations: [
      { name: "Craggy Range Viognier", price: "$30", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=craggy+range+viognier" },
      { name: "Yves Cuilleron Condrieu", price: "$65", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=cuilleron+condrieu" },
    ],
  },
  {
    id: "chenin-blanc", name: "Chenin Blanc", colour: "white",
    profile: { body: 5, acidity: 8, tannin: 1, sweetness: 4, fruit: 6, floral: 5, spice: 3, earth: 5, oak: 3, alcohol: 5, complexity: 8 },
    description: "The chameleon grape — dry, off-dry, sweet, sparkling. Loire Valley Chenin has the richness you love with electric acidity.",
    tastingNotes: "Quince, honey, chamomile, lanolin, apple, ginger, beeswax.",
    foodPairing: "Pork, goat cheese, Thai, roast chicken, creamy dishes.",
    regions: "Loire Valley (Vouvray, Savennières), South Africa (Swartland)",
    recommendations: [
      { name: "Domaine Huet Vouvray Sec", price: "$40", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=huet+vouvray" },
    ],
  },
  {
    id: "albarino", name: "Albariño", colour: "white",
    profile: { body: 3, acidity: 7, tannin: 1, sweetness: 1, fruit: 7, floral: 4, spice: 2, earth: 4, oak: 0, alcohol: 5, complexity: 5 },
    description: "Spain's Atlantic coast white — saline, mineral, made for seafood. Going to become your Auckland summer staple.",
    tastingNotes: "Peach, apricot, lemon zest, sea salt, wet stone, almond blossom.",
    foodPairing: "Oysters, ceviche, sushi, grilled fish, seafood pasta.",
    regions: "Rías Baixas (Galicia), Vinho Verde (Portugal)",
    recommendations: [
      { name: "Pazo de Señoráns Albariño", price: "$30", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=pazo+senoran+albarino" },
    ],
  },
  {
    id: "gruner-veltliner", name: "Grüner Veltliner", colour: "white",
    profile: { body: 4, acidity: 7, tannin: 1, sweetness: 1, fruit: 5, floral: 3, spice: 6, earth: 5, oak: 1, alcohol: 5, complexity: 6 },
    description: "Austria's signature grape — peppery, mineral, wildly versatile. The white pepper note will connect with your Syrah-loving palate.",
    tastingNotes: "White pepper, green bean, citrus, lentil, radish, stone fruit, mineral.",
    foodPairing: "Asian food (Vietnamese, Japanese), schnitzel, salads, white fish.",
    regions: "Wachau, Kamptal, Kremstal (Austria)",
    recommendations: [
      { name: "Bründlmayer Grüner Veltliner", price: "$30", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=brundlmayer+gruner" },
    ],
  },
  {
    id: "arneis", name: "Arneis", colour: "white",
    profile: { body: 4, acidity: 5, tannin: 1, sweetness: 2, fruit: 6, floral: 5, spice: 2, earth: 3, oak: 1, alcohol: 5, complexity: 5 },
    description: "Piedmont's elegant white. You already love Beach House La Plage Arneis from NZ.",
    tastingNotes: "Pear, almond, white peach, white flowers, hint of herbs.",
    foodPairing: "Light pasta, seafood risotto, grilled vegetables, antipasti.",
    regions: "Roero (Piedmont), NZ, Australia",
    recommendations: [
      { name: "Beach House La Plage Arneis", price: "$30", shop: "Beach House Wines", url: "https://www.beachhouse.co.nz/product/arneis-2025/" },
    ],
  },
  {
    id: "marsanne-roussanne", name: "Marsanne / Roussanne", colour: "white",
    profile: { body: 7, acidity: 4, tannin: 1, sweetness: 2, fruit: 5, floral: 5, spice: 4, earth: 4, oak: 4, alcohol: 6, complexity: 6 },
    description: "The white grapes of the Northern Rhône — rich, waxy, honeyed. These should be in your rotation.",
    tastingNotes: "Almond, beeswax, white peach, quince, herbal, honey, marzipan.",
    foodPairing: "Rich fish, lobster, creamy chicken, risotto, mild curries.",
    regions: "Northern Rhône (Hermitage, Saint-Joseph, Crozes), Languedoc",
    recommendations: [
      { name: "Chapoutier Crozes-Hermitage Blanc", price: "$35", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=chapoutier+crozes+blanc" },
    ],
  },
  {
    id: "rose", name: "Rosé (Provence & Beyond)", colour: "rosé",
    profile: { body: 3, acidity: 6, tannin: 1, sweetness: 1, fruit: 6, floral: 4, spice: 2, earth: 2, oak: 0, alcohol: 5, complexity: 3 },
    description: "Your summer staple. Pale, dry, crisp Provençal rosé is the benchmark.",
    tastingNotes: "Strawberry, watermelon, white peach, herbs, citrus.",
    foodPairing: "Seafood, salads, grilled fish, Mediterranean mezze, sushi.",
    regions: "Provence, Bandol, Tavel, NZ (Central Otago, Marlborough)",
    recommendations: [
      { name: "Domaines Ott Côtes de Provence", price: "$45", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=ott+provence+rose" },
      { name: "Peregrine Rosé", price: "$25", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=peregrine+rose" },
    ],
  },
  {
    id: "champagne", name: "Champagne", colour: "sparkling",
    profile: { body: 4, acidity: 8, tannin: 1, sweetness: 2, fruit: 5, floral: 5, spice: 3, earth: 5, oak: 2, alcohol: 5, complexity: 9 },
    description: "Champagne on a Tuesday — that's you. Perrier-Jouët is your big house pick. Lean elegant and Chardonnay-driven.",
    tastingNotes: "Brioche, green apple, citrus, chalk, almond, toast, white flowers.",
    foodPairing: "Everything. Oysters, fried chicken, sushi, chips, or absolutely nothing.",
    regions: "Champagne, France",
    recommendations: [
      { name: "Pierre Gimonnet Cuvée Gastronome", price: "$60", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=gimonnet+champagne" },
      { name: "Larmandier-Bernier Latitude", price: "$65", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=larmandier+bernier" },
      { name: "Perrier-Jouët Grand Brut", price: "$60", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=perrier+jouet" },
    ],
  },
  {
    id: "methode", name: "NZ Méthode Traditionnelle", colour: "sparkling",
    profile: { body: 3, acidity: 7, tannin: 1, sweetness: 2, fruit: 6, floral: 4, spice: 2, earth: 3, oak: 1, alcohol: 5, complexity: 5 },
    description: "NZ makes brilliant traditional-method sparkling. At $25–40, often better value than entry-level Champagne.",
    tastingNotes: "Apple, citrus, brioche, yeast, stone fruit.",
    foodPairing: "Brunch, seafood, snacks, celebrations.",
    regions: "Marlborough, Central Otago, Martinborough",
    recommendations: [
      { name: "No.1 Family Estate Cuvée", price: "$35", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=no+1+family+cuvee" },
      { name: "Quartz Reef Méthode", price: "$35", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=quartz+reef+methode" },
    ],
  },
  {
    id: "cremant", name: "Crémant", colour: "sparkling",
    profile: { body: 3, acidity: 7, tannin: 1, sweetness: 2, fruit: 6, floral: 4, spice: 2, earth: 3, oak: 1, alcohol: 5, complexity: 5 },
    description: "France's other sparkling wines — Alsace, Loire, Burgundy, Jura. Same method as Champagne, half the price.",
    tastingNotes: "Apple, pear, citrus, brioche, hazelnut.",
    foodPairing: "Aperitif, light seafood, brunch, canapés.",
    regions: "Alsace, Loire, Burgundy, Jura, Limoux",
    recommendations: [
      { name: "Lucien Albrecht Crémant d'Alsace", price: "$25", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=albrecht+cremant" },
    ],
  },
  {
    id: "tawny-port", name: "Tawny Port", colour: "fortified",
    profile: { body: 7, acidity: 4, tannin: 3, sweetness: 8, fruit: 5, floral: 2, spice: 6, earth: 4, oak: 8, alcohol: 9, complexity: 9 },
    description: "Your after-dinner wine. 10-year and 20-year Tawny are extraordinary complexity for the price.",
    tastingNotes: "Caramel, walnut, dried apricot, orange peel, butterscotch, coffee, cinnamon.",
    foodPairing: "Crème brûlée, blue cheese, dark chocolate, pecan pie.",
    regions: "Douro Valley, Portugal",
    recommendations: [
      { name: "Graham's 20 Year Tawny", price: "$65", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=grahams+20+year+tawny" },
      { name: "Taylor's 10 Year Tawny", price: "$40", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=taylors+10+year+tawny" },
    ],
  },
  {
    id: "vermouth", name: "Vermouth", colour: "fortified",
    profile: { body: 5, acidity: 5, tannin: 2, sweetness: 5, fruit: 4, floral: 5, spice: 7, earth: 4, oak: 3, alcohol: 6, complexity: 7 },
    description: "Your aperitif — on ice or in a Negroni. You own Mancino Chinato.",
    tastingNotes: "Bitter herbs, orange peel, wormwood, vanilla, caramel, dried flowers.",
    foodPairing: "Pre-dinner aperitif, olives, cured meats, almonds.",
    regions: "Italy (Turin), France (Chambéry), Spain (Reus), Australia",
    recommendations: [
      { name: "Lustau Vermut Rojo", price: "$35", shop: "Glengarry", url: "https://www.glengarry.co.nz/search?q=lustau+vermouth" },
      { name: "Cocchi Vermouth di Torino", price: "$35", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=cocchi+vermouth" },
    ],
  },
  {
    id: "orange-wine", name: "Orange / Skin-Contact Wine", colour: "orange",
    profile: { body: 6, acidity: 6, tannin: 4, sweetness: 1, fruit: 4, floral: 3, spice: 5, earth: 7, oak: 2, alcohol: 5, complexity: 7 },
    description: "White grapes made like reds — fermented on their skins. On your curiosity list.",
    tastingNotes: "Dried apricot, honey, tea, nuts, orange peel, herbs, beeswax.",
    foodPairing: "Middle Eastern food, roast vegetables, rich curries, aged cheeses.",
    regions: "Georgia, Friuli, Slovenia, NZ (emerging), Austria",
    recommendations: [
      { name: "Sato Pinot Gris (skin contact)", price: "$40", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=sato+pinot+gris" },
    ],
  },
  {
    id: "cabernet-franc", name: "Cabernet Franc", colour: "red",
    profile: { body: 5, acidity: 6, tannin: 5, sweetness: 1, fruit: 6, floral: 5, spice: 5, earth: 5, oak: 3, alcohol: 5, complexity: 6 },
    description: "The elegant parent of Cabernet Sauvignon — lighter, more aromatic. Loire Valley Cab Franc is extraordinary value.",
    tastingNotes: "Raspberry, violet, graphite, green bell pepper, dried herbs, tobacco.",
    foodPairing: "Roast pork, grilled vegetables, ratatouille, goat cheese.",
    regions: "Loire Valley (Chinon, Bourgueil, Saumur), Bordeaux",
    recommendations: [
      { name: "Charles Joguet Chinon", price: "$35", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=joguet+chinon" },
    ],
  },
  {
    id: "trousseau", name: "Trousseau / Jura Reds", colour: "red",
    profile: { body: 3, acidity: 7, tannin: 3, sweetness: 1, fruit: 6, floral: 5, spice: 4, earth: 6, oak: 1, alcohol: 4, complexity: 6 },
    description: "A Jura specialty — light, ethereal, perfect chilled in summer. If you love light Pinot, Trousseau takes it further.",
    tastingNotes: "Red cherry, cranberry, rose hip, earth, smoke, herbs.",
    foodPairing: "Charcuterie, Comté cheese, light salads, grilled fish, picnics.",
    regions: "Jura (France)",
    recommendations: [
      { name: "Domaine de la Borde Trousseau", price: "$40", shop: "Fine Wine Delivery", url: "https://www.finewindelivery.co.nz/search?q=borde+trousseau+jura" },
    ],
  },
];

// ─── Your Drinking History (from Airtable) ──────────────────────────────────
const DRINKING_HISTORY = {
  "Pinot Noir": { drank: 8, inCellar: 0, wishlist: 3, producers: ["Chard Farm", "Rabbit Ranch", "Felton Road", "Bald Hills", "Little Giant", "Gibbston Valley", "Domaine-Thomson"] },
  "Syrah": { drank: 6, inCellar: 0, wishlist: 0, producers: ["Mudbrick", "Penfolds", "Millars Vineyard", "Taylors", "Mission Estate"] },
  "Bordeaux Blend": { drank: 6, inCellar: 0, wishlist: 2, producers: ["Craggy Range", "Brick Bay", "Emancipation", "Man O' War", "Mudbrick"] },
  "Chardonnay": { drank: 3, inCellar: 0, wishlist: 0, producers: ["Chard Farm", "Odyssey", "Cave de Lugny", "Kumeu River"] },
  "Sauvignon Blanc": { drank: 3, inCellar: 0, wishlist: 2, producers: ["Craggy Range", "Dog Point", "Man O' War", "Te Mata Estate"] },
  "Riesling": { drank: 3, inCellar: 0, wishlist: 0, producers: ["Chard Farm", "Peregrine", "Amisfield", "Mission Estate"] },
  "Gewürztraminer": { drank: 3, inCellar: 1, wishlist: 0, producers: ["Rippon", "Matawhero", "Vinoptima Estate"] },
  "Champagne": { drank: 3, inCellar: 1, wishlist: 0, producers: ["Perrier-Jouët", "Veuve Clicquot", "G.H. Mumm"] },
  "Rosé": { drank: 3, inCellar: 1, wishlist: 0, producers: ["Brick Bay", "Jurassic Ridge", "Michel Chapoutier", "Man O' War"] },
  "Tawny Port": { drank: 1, inCellar: 1, wishlist: 0, producers: ["Soljans Estate", "Fonseca"] },
  "Pinot Gris": { drank: 2, inCellar: 0, wishlist: 0, producers: ["Brick Bay", "Willy Gisselbrecht"] },
  "Chenin Blanc": { drank: 1, inCellar: 0, wishlist: 0, producers: ["Matawhero"] },
  "Arneis": { drank: 0, inCellar: 1, wishlist: 0, producers: ["Beach House Wines"] },
  "NZ Méthode": { drank: 1, inCellar: 0, wishlist: 0, producers: ["Isabel Estate"] },
  "Cabernet Sauvignon": { drank: 1, inCellar: 0, wishlist: 0, producers: ["Rymill"] },
  "Vermouth": { drank: 0, inCellar: 1, wishlist: 0, producers: ["Mancino"] },
  "Sherry": { drank: 0, inCellar: 1, wishlist: 0, producers: ["Matusalem"] },
  "Ruby Port": { drank: 1, inCellar: 0, wishlist: 0, producers: ["Taylor's"] },
  "Blanc de Noir": { drank: 0, inCellar: 1, wishlist: 0, producers: ["Mt Rosa"] },
};

// ─── Constants ──────────────────────────────────────────────────────────────
const COLOUR_MAP = {
  red: { bg: "bg-red-50", border: "border-red-200", accent: "bg-red-600", text: "text-red-700", chart: "#991b1b" },
  white: { bg: "bg-amber-50", border: "border-amber-200", accent: "bg-amber-500", text: "text-amber-700", chart: "#d97706" },
  "rosé": { bg: "bg-pink-50", border: "border-pink-200", accent: "bg-pink-400", text: "text-pink-700", chart: "#db2777" },
  sparkling: { bg: "bg-yellow-50", border: "border-yellow-200", accent: "bg-yellow-400", text: "text-yellow-700", chart: "#ca8a04" },
  fortified: { bg: "bg-purple-50", border: "border-purple-200", accent: "bg-purple-600", text: "text-purple-700", chart: "#7c3aed" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", accent: "bg-orange-500", text: "text-orange-700", chart: "#ea580c" },
};

const TABS = [
  { id: "explore", label: "Explore" },
  { id: "buy", label: "What to Buy" },
  { id: "compare", label: "Compare" },
];
const FILTERS = ["All", "Red", "White", "Rosé", "Sparkling", "Fortified", "Orange"];
const PROFILE_KEYS = [
  { key: "body", label: "Body" }, { key: "acidity", label: "Acidity" }, { key: "tannin", label: "Tannin" },
  { key: "sweetness", label: "Sweet" }, { key: "fruit", label: "Fruit" }, { key: "floral", label: "Floral" },
  { key: "spice", label: "Spice" }, { key: "earth", label: "Earth" }, { key: "oak", label: "Oak" },
  { key: "alcohol", label: "Alcohol" }, { key: "complexity", label: "Complex" },
];

// ─── Components ─────────────────────────────────────────────────────────────
function RadarProfile({ varietal, compareTo, height = 280 }) {
  const data = PROFILE_KEYS.map(({ key, label }) => ({
    subject: label, [varietal.name]: varietal.profile[key],
    ...(compareTo ? { [compareTo.name]: compareTo.profile[key] } : {}),
  }));
  const c = COLOUR_MAP[varietal.colour] || COLOUR_MAP.red;
  const c2 = compareTo ? (COLOUR_MAP[compareTo.colour] || COLOUR_MAP.red) : null;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="68%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#6b7280" }} />
        <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
        <Radar name={varietal.name} dataKey={varietal.name} stroke={c.chart} fill={c.chart} fillOpacity={compareTo ? 0.15 : 0.2} strokeWidth={2} />
        {compareTo && <Radar name={compareTo.name} dataKey={compareTo.name} stroke={c2.chart} fill={c2.chart} fillOpacity={0.15} strokeWidth={2} strokeDasharray="5 5" />}
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function StarRating({ rating, onRate }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((s) => (
        <button key={s} onClick={() => onRate(s)} className={`text-lg transition-colors ${s <= rating ? "text-yellow-500" : "text-gray-300"} hover:text-yellow-400`}>★</button>
      ))}
    </div>
  );
}

function VarietalCard({ varietal, onSelect, rating, onRate }) {
  const c = COLOUR_MAP[varietal.colour] || COLOUR_MAP.red;
  const history = DRINKING_HISTORY[varietal.name];
  const totalDrunk = history ? history.drank : 0;
  return (
    <div className={`rounded-xl border-2 border-gray-200 p-4 cursor-pointer transition-all hover:shadow-md hover:border-gray-300 bg-white active:scale-[0.98]`} onClick={() => onSelect(varietal)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">{varietal.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full text-white ${c.accent}`}>{varietal.colour}</span>
            {totalDrunk > 0 && <span className="text-xs text-gray-400">{totalDrunk} logged</span>}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{varietal.description.split('.')[0]}.</p>
      <div onClick={(e) => e.stopPropagation()}><StarRating rating={rating || 0} onRate={(r) => onRate(varietal.id, r)} /></div>
    </div>
  );
}

function VarietalDetail({ varietal, rating, onRate, onBack }) {
  const c = COLOUR_MAP[varietal.colour] || COLOUR_MAP.red;
  return (
    <div className="space-y-4">
      {onBack && <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">← Back</button>}
      <div className={`rounded-xl border-2 ${c.border} ${c.bg} p-4 sm:p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{varietal.name}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{varietal.regions}</p>
          </div>
          <StarRating rating={rating || 0} onRate={(r) => onRate(varietal.id, r)} />
        </div>

        {/* Radar + Info — stacks on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <RadarProfile varietal={varietal} height={260} />
          <div className="space-y-3">
            <div><h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wide mb-1">About</h4><p className="text-sm text-gray-700 leading-relaxed">{varietal.description}</p></div>
            <div><h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wide mb-1">Tasting Notes</h4><p className="text-sm text-gray-700 leading-relaxed">{varietal.tastingNotes}</p></div>
            <div><h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wide mb-1">Food Pairing</h4><p className="text-sm text-gray-700 leading-relaxed">{varietal.foodPairing}</p></div>
          </div>
        </div>

        {/* Buy links */}
        <div className="mt-5">
          <h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wide mb-3">Buy in Auckland</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {varietal.recommendations.map((rec, i) => (
              <a key={i} href={rec.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all group active:bg-gray-50">
                <div className="min-w-0 flex-1 mr-2"><p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">{rec.name}</p><p className="text-xs text-gray-500">{rec.shop}</p></div>
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{rec.price}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareView({ varietals, ratings, onRate }) {
  const [selected, setSelected] = useState([varietals[0]?.id, varietals[1]?.id]);
  const w1 = varietals.find((v) => v.id === selected[0]);
  const w2 = varietals.find((v) => v.id === selected[1]);
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Wine 1</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" value={selected[0]} onChange={(e) => setSelected([e.target.value, selected[1]])}>{varietals.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
        </div>
        <span className="text-gray-400 font-bold text-lg text-center sm:mt-5">vs</span>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Wine 2</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" value={selected[1]} onChange={(e) => setSelected([selected[0], e.target.value])}>{varietals.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
        </div>
      </div>
      {w1 && w2 && (
        <div className="space-y-4">
          <RadarProfile varietal={w1} compareTo={w2} height={300} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <VarietalDetail varietal={w1} rating={ratings[w1.id]} onRate={onRate} />
            <VarietalDetail varietal={w2} rating={ratings[w2.id]} onRate={onRate} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── What to Buy ────────────────────────────────────────────────────────────
function WhatToBuy({ onNavigate }) {
  const [buyFilter, setBuyFilter] = useState("all");

  const recommendations = useMemo(() => {
    const recs = [];

    const restockCandidates = VARIETALS.filter((v) => {
      const h = DRINKING_HISTORY[v.name];
      return h && h.drank >= 3 && h.inCellar === 0;
    }).sort((a, b) => (DRINKING_HISTORY[b.name]?.drank || 0) - (DRINKING_HISTORY[a.name]?.drank || 0));
    restockCandidates.forEach((v) => {
      const h = DRINKING_HISTORY[v.name];
      v.recommendations.slice(0, 2).forEach((rec) => {
        recs.push({ ...rec, varietal: v, category: "restock", reason: `${h.drank} bottles logged, none in the fridge. Time to restock.`, priority: h.drank });
      });
    });

    const wishlistVarietals = VARIETALS.filter((v) => { const h = DRINKING_HISTORY[v.name]; return h && h.wishlist > 0; });
    wishlistVarietals.forEach((v) => {
      const h = DRINKING_HISTORY[v.name];
      v.recommendations.slice(0, 1).forEach((rec) => {
        recs.push({ ...rec, varietal: v, category: "wishlist", reason: `${h.wishlist} on your wishlist.`, priority: h.wishlist + (h.drank || 0) });
      });
    });

    const unexplored = VARIETALS.filter((v) => { const h = DRINKING_HISTORY[v.name]; return !h || (h.drank === 0 && h.inCellar === 0 && h.wishlist === 0); });
    unexplored.forEach((v) => {
      v.recommendations.slice(0, 1).forEach((rec) => {
        recs.push({ ...rec, varietal: v, category: "explore", reason: v.description.split('.')[0] + '.', priority: v.profile.complexity });
      });
    });

    const levelUp = VARIETALS.filter((v) => { const h = DRINKING_HISTORY[v.name]; return h && h.drank >= 1 && h.drank <= 2 && h.inCellar === 0; });
    levelUp.forEach((v) => {
      const h = DRINKING_HISTORY[v.name];
      v.recommendations.filter((rec) => !h.producers.some((p) => rec.name.includes(p))).slice(0, 1).forEach((rec) => {
        recs.push({ ...rec, varietal: v, category: "level-up", reason: `Tried from ${h.producers.slice(0, 2).join(", ")}. Try a new producer.`, priority: v.profile.complexity });
      });
    });

    return recs;
  }, []);

  const categoryInfo = {
    restock: { label: "Restock Favourites", icon: "↻", desc: "Wines you love but don't have" },
    wishlist: { label: "From Your Wishlist", icon: "★", desc: "Already on your radar" },
    "level-up": { label: "Level Up", icon: "↑", desc: "Try a new producer" },
    explore: { label: "New Horizons", icon: "→", desc: "Varietals to discover" },
  };

  const filtered = buyFilter === "all" ? recommendations : recommendations.filter((r) => r.category === buyFilter);
  const grouped = {};
  filtered.forEach((r) => { if (!grouped[r.category]) grouped[r.category] = []; grouped[r.category].push(r); });
  const categoryOrder = ["restock", "wishlist", "level-up", "explore"];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">Personalised for your palate</h3>
        <p className="text-sm text-gray-500 mb-3">Based on your 66-bottle drinking history.</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setBuyFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${buyFilter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>All</button>
          {categoryOrder.map((cat) => {
            const count = recommendations.filter((r) => r.category === cat).length;
            if (count === 0) return null;
            return <button key={cat} onClick={() => setBuyFilter(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${buyFilter === cat ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>{categoryInfo[cat].icon} {categoryInfo[cat].label}</button>;
          })}
        </div>
      </div>

      {categoryOrder.map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const info = categoryInfo[cat];
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-bold text-gray-700">{info.icon}</span>
              <h3 className="font-semibold text-gray-900">{info.label}</h3>
              <span className="text-sm text-gray-400 hidden sm:inline">— {info.desc}</span>
            </div>
            <div className="space-y-2">
              {items.sort((a, b) => b.priority - a.priority).map((rec, i) => {
                const c = COLOUR_MAP[rec.varietal.colour] || COLOUR_MAP.red;
                return (
                  <div key={`${cat}-${i}`} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0 sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full text-white ${c.accent}`}>{rec.varietal.name}</span>
                          <span className="text-sm font-semibold text-gray-700">{rec.price}</span>
                          <span className="text-xs text-gray-400">{rec.shop}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{rec.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{rec.reason}</p>
                      </div>
                      <div className="flex gap-2 sm:ml-4 sm:flex-shrink-0">
                        <button onClick={() => onNavigate(rec.varietal)} className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-center">Profile</button>
                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors text-center">Buy →</a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────
export default function WineDashboard() {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedVarietal, setSelectedVarietal] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState({});

  const filteredVarietals = useMemo(() => {
    let list = VARIETALS;
    if (filter !== "All") list = list.filter((v) => v.colour.toLowerCase() === filter.toLowerCase());
    if (search) { const q = search.toLowerCase(); list = list.filter((v) => v.name.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)); }
    return list;
  }, [filter, search]);

  const handleRate = (id, rating) => setRatings((prev) => ({ ...prev, [id]: rating }));

  const navigateToVarietal = (varietal) => {
    setActiveTab("explore");
    setSelectedVarietal(varietal);
    setFilter("All");
    setSearch("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Wine Intelligence</h1>
        <p className="text-gray-500 text-sm mt-1">Your personal sommelier — 27 varietals, personalised to your palate</p>
      </div>

      {/* Tab bar — horizontal scroll on mobile */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5 sm:mb-6 w-full sm:w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedVarietal(null); }} className={`flex-1 sm:flex-initial px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}>{tab.label}</button>
        ))}
      </div>

      {/* Explore tab */}
      {activeTab === "explore" && (
        <div className="space-y-4 sm:space-y-6">
          {!selectedVarietal && (
            <>
              {/* Filter pills — horizontal scroll on mobile */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {FILTERS.map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${filter === f ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200"}`}>{f}</button>
                ))}
              </div>
              <input type="text" placeholder="Search varietals..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={search} onChange={(e) => setSearch(e.target.value)}/>
              {/* Card grid — 1 col mobile, 2 tablet, 3 desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredVarietals.map((v) => <VarietalCard key={v.id} varietal={v} onSelect={setSelectedVarietal} rating={ratings[v.id]} onRate={handleRate} />)}
              </div>
            </>
          )}
          {selectedVarietal && (
            <VarietalDetail varietal={selectedVarietal} rating={ratings[selectedVarietal.id]} onRate={handleRate} onBack={() => setSelectedVarietal(null)} />
          )}
        </div>
      )}

      {/* What to Buy tab */}
      {activeTab === "buy" && <WhatToBuy onNavigate={navigateToVarietal} />}

      {/* Compare tab */}
      {activeTab === "compare" && <CompareView varietals={VARIETALS} ratings={ratings} onRate={handleRate} />}
    </div>
  );
}
