const fillers = {
  region: ["Italian", "Mexican", "Japanese", "Indian", "French", "Chinese", "Thai", "Brazilian", "Moroccan", "Greek", "Turkish", "Spanish"],
  flavorPrefix: ["Sweet", "Savory", "Spicy", "Herbal", "Tangy", "Umami-rich", "Smoky", "Mild", "Creamy", "Crispy"],
  flavorBase: ["tomato", "chili", "soy", "curry", "garlic", "lemon", "coconut", "yogurt", "mint", "honey"],
  dishType: ["soup", "stew", "curry", "salad", "sandwich", "cake", "stir-fry", "pastry", "taco", "sushi roll"],
  ingredient: ["chicken", "tofu", "lamb", "pork belly", "mushrooms", "eggplant", "beef", "shrimp", "cod", "lentils"],
  quantity: ["a generous portion of", "a handful of", "a few", "several", "plenty of", "a dash of", "a sprinkle of", "a scoop of", "a slice of"],
  adjective: ["fresh", "exotic", "local", "seasonal", "organic", "aromatic", "crunchy", "juicy", "tender", "crisp"],
  components: ["rice", "noodles", "bread", "lettuce wraps", "potato wedges", "quinoa", "pita", "pasta", "tortillas", "seaweed"],
  utensils: ["knife", "frying pan", "blender", "oven", "grill", "mortar and pestle", "steamer", "microwave", "saucepan", "skillet"],
  message: ["request", "plea", "summons", "invitation", "proposal", "demand", "suggestion", "inquiry", "urge", "call"],
};

const template = `$region food enthusiast, heed my $message!

I have a craving for a $flavorPrefix $flavorBase $dishType, and only you can prepare it. In your kitchen, use your $utensils to combine $quantity $adjective $ingredient with $quantity $adjective $components.

This dish will surely satisfy any craving for authentic $region cuisine. Please prepare it at once and share the delights of your culinary skills!
`;
// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
