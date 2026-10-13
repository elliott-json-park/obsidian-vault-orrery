/* ============================================================================
   demo-sample.js — the vault the demo opens with.

   Served only by the demo (scripts/build-demo.mjs injects it); the plugin
   never loads it, and neither does the page when it is opened from disk.

   Why it exists: the page is a vault viewer with no vault, so a visitor who
   does not immediately drag a folder onto it is looking at an empty starfield
   — which is a picture of nothing, and the one thing the demo exists to avoid.
   The notes arrive before the boot screen is dismissed, so the first thing
   anyone sees is the thing being demonstrated. Dropping a real folder
   replaces it, which is the whole point of being here.

   The notes are the Orrery demo vault, written out verbatim — every markdown
   file Obsidian would index (dot-folders are skipped, as Obsidian skips them).
   Their text is placeholder prose; what is real is the shape: the folders,
   the file names and the links between them. Nothing here sets a knob, so
   the demo opens on the plugin's shipped defaults.

   It goes through the same public entry a host uses — vaultOrrery.load() —
   rather than reaching inside the engine, so it cannot drift from what the
   plugin does with a real vault: same parser, same graph, same gates.

   Nothing here touches the network. The notes are written out below.
   ========================================================================= */
(function () {
  'use strict';

  /* ---- the notes: [path, text] ------------------------------------------ */
  var NOTES = [
    ["CLAUDE.md","The morning train drifted past a forgotten staircase long after midnight.\n\n[[Books and Thinkers]] [[Chronicle]]\n"],
    ["raw/00. Big Five Overall Profile.md","An old notebook drifted past a field of sunflowers as the kettle began to sing.\n"],
    ["raw/01. N - Neuroticism.md","The neighbor's cat rested beneath an open door while nobody was watching.\n"],
    ["raw/02. E - Extraversion.md","The tired clockmaker hummed softly near a forgotten staircase in the middle of spring.\n"],
    ["raw/03. O - Openness.md","The neighbor's cat wandered toward an open door long after midnight.\n"],
    ["raw/04. A - Agreeableness.md","The quiet river quietly remembered a forgotten staircase in the middle of spring.\n"],
    ["raw/05. C - Conscientiousness.md","A folded letter slowly circled the edge of the map as the kettle began to sing.\n"],
    ["raw/06. Eight Behavior Styles.md","A folded letter waited patiently beside a field of sunflowers in the middle of spring.\n"],
    ["raw/07. Key Insights and Strategies.md","The morning train leaned against a jar of fireflies without saying a word.\n"],
    ["raw/2022-07-05 On Art.md","A stray melody drifted past a forgotten staircase for no particular reason.\n"],
    ["raw/2022-07-07 On Human Diversity (2).md","The tired clockmaker waited patiently beside the blue hour on a slow Sunday.\n"],
    ["raw/2022-07-07 On Human Diversity.md","The tired clockmaker slowly circled a jar of fireflies without saying a word.\n"],
    ["raw/2022-07-12 Does Physics Apply to the Mind.md","A cracked teacup lingered by a field of sunflowers while nobody was watching.\n"],
    ["raw/2022-07-12 Why Death Is Frightening.md","The neighbor's cat slowly circled a field of sunflowers as the kettle began to sing.\n"],
    ["raw/2022-07-14 Is Capital Punishment a Rights Violation.md","The morning train glowed faintly over the winter window for no particular reason.\n"],
    ["raw/2022-07-14 Jaywalking on an Empty Road.md","The lighthouse keeper quietly remembered a crowded market without saying a word.\n"],
    ["raw/2022-08-10 Summer Camp Review.md","A cracked teacup spun lazily around the winter window on a slow Sunday.\n"],
    ["raw/2022-08-16 People I Can Always Trust.md","The last bus rested beneath a forgotten staircase as the kettle began to sing.\n"],
    ["raw/2022-09-05 A Clover Who Wanted to Direct Films.md","The tired clockmaker hummed softly near the evening tide without saying a word.\n"],
    ["raw/2022-09-05 Notes on Heart Stones.md","The last bus wandered toward the blue hour long after midnight.\n"],
    ["raw/2022-09-12 How to Live Longer.md","An old notebook hummed softly near a jar of fireflies while nobody was watching.\n"],
    ["raw/2022-09-14 Chronic Loneliness.md","A folded letter glowed faintly over the winter window on a slow Sunday.\n"],
    ["raw/2022-09-14 Save the Best Songs.md","A cracked teacup spun lazily around a pile of autumn leaves in the middle of spring.\n"],
    ["raw/2022-09-14 Taking Out Music Like Snacks.md","A cracked teacup whispered something to a forgotten staircase without saying a word.\n"],
    ["raw/2022-09-17 Sentence One.md","A rusty bicycle quietly remembered the winter window just before the rain.\n"],
    ["raw/2022-09-18 Why Judgments Should Stay Private.md","The neighbor's cat lingered by the distant mountains long after midnight.\n"],
    ["raw/2022-09-23 Fifty Questions.md","The midnight bakery whispered something to the blue hour without saying a word.\n"],
    ["raw/2022-09-26 Ice Cream as a Birthday Gift.md","The neighbor's cat quietly remembered the distant mountains for no particular reason.\n"],
    ["raw/2022-09-26 What My Uncle Said.md","A borrowed umbrella drifted past a jar of fireflies on a slow Sunday.\n"],
    ["raw/2022-10-03 No Need to Please Everyone and Four More.md","A paper lantern spun lazily around the edge of the map in the middle of spring.\n"],
    ["raw/2022-10-05 Burned Out Completely.md","A borrowed umbrella glowed faintly over the blue hour for no particular reason.\n"],
    ["raw/2022-10-18 Are Standardized Tests Repeating Old Mistakes.md","A small comet slowly circled the distant mountains while nobody was watching.\n"],
    ["raw/2022-10-19 Giving a Song as a Gift.md","The morning train spun lazily around the distant mountains long after midnight.\n"],
    ["raw/2022-10-22 Why That Drama Got to Me.md","A folded letter waited patiently beside the winter window in the middle of spring.\n"],
    ["raw/2022-10-29 What Do I Really Love.md","The last bus wandered toward the sleeping harbor long after midnight.\n"],
    ["raw/2022-11-05 Midterm Retrospective on Art.md","A small comet quietly remembered the distant mountains on a slow Sunday.\n"],
    ["raw/2022-11-07 At the End of the Day.md","The empty library spun lazily around the distant mountains as the kettle began to sing.\n"],
    ["raw/2022-11-21 Rare Sounds.md","A paper lantern leaned against the hum of the city just before the rain.\n"],
    ["raw/2022-11-29 How Long Until Old Cringe Feels Fine.md","The tired clockmaker rested beneath the sleeping harbor without saying a word.\n"],
    ["raw/2022-11-30 A Six Step Argument.md","The forgotten garden drifted past a field of sunflowers without saying a word.\n"],
    ["raw/2022-12-23 Soft Snow Falling.md","The empty library hummed softly near the sleeping harbor as the kettle began to sing.\n"],
    ["raw/2022-12-23 Who Is the True Teacher.md","A borrowed umbrella waited patiently beside a forgotten staircase for no particular reason.\n"],
    ["raw/2022-12-28 Watched by Myself.md","A borrowed umbrella rested beneath the hum of the city just before the rain.\n"],
    ["raw/2022-12-30 No Eternal Joy No Eternal Sorrow.md","A paper lantern spun lazily around a pile of autumn leaves just before the rain.\n"],
    ["raw/2023-01-11 City Trip Review.md","A stray melody rested beneath a jar of fireflies in the middle of spring.\n"],
    ["raw/2023-01-16 Foreign Body Sensation.md","A cracked teacup rested beneath the hum of the city as the kettle began to sing.\n"],
    ["raw/2023-01-16 Peckish vs Hungry.md","The empty library glowed faintly over the evening tide without saying a word.\n"],
    ["raw/2023-01-19 The Heart That Does Not Run.md","A rusty bicycle rested beneath a pile of autumn leaves on a slow Sunday.\n"],
    ["raw/2023-02-04 Visible Breath.md","The neighbor's cat hummed softly near a field of sunflowers without saying a word.\n"],
    ["raw/2023-02-15 Mori.md","The quiet river whispered something to the distant mountains as the kettle began to sing.\n"],
    ["raw/2023-03-09 Always on Edge.md","The neighbor's cat drifted past a field of sunflowers while nobody was watching.\n"],
    ["raw/2023-03-13 D-29.md","The neighbor's cat waited patiently beside the sleeping harbor without saying a word.\n"],
    ["raw/2023-03-18 Let Me Live Squinting.md","A borrowed umbrella rested beneath an unfinished sentence long after midnight.\n"],
    ["raw/2023-03-19 May Those Memories Stay Warm.md","The forgotten garden hummed softly near the distant mountains just before the rain.\n"],
    ["raw/2023-03-20 So Many Selves.md","The forgotten garden hummed softly near the hum of the city for no particular reason.\n"],
    ["raw/2023-03-21 Looseness.md","The midnight bakery hummed softly near a field of sunflowers on a slow Sunday.\n"],
    ["raw/2023-03-24 Isnt It Free.md","A rusty bicycle lingered by the sleeping harbor on a slow Sunday.\n"],
    ["raw/2023-03-24 Seize the Chance.md","The midnight bakery leaned against the blue hour in the middle of spring.\n"],
    ["raw/2023-04-08 Cat Guitar Piano.md","An old notebook glowed faintly over a forgotten staircase without saying a word.\n"],
    ["raw/2023-04-08 What Meaning.md","The morning train hummed softly near an unfinished sentence as the kettle began to sing.\n"],
    ["raw/2023-05-26 On Expecting.md","The tired clockmaker wandered toward the edge of the map in the middle of spring.\n"],
    ["raw/2023-05-26 Trusting Infinite Time.md","The last bus slowly circled a pile of autumn leaves as the kettle began to sing.\n"],
    ["raw/2023-05-28 Semantic Satiation and Names.md","A borrowed umbrella wandered toward the hum of the city on a slow Sunday.\n"],
    ["raw/2023-06-02 Early Summer Air Mass.md","A borrowed umbrella hummed softly near the edge of the map in the middle of spring.\n"],
    ["raw/2023-06-02 Life Swings Between Desire and Boredom.md","An old notebook spun lazily around the distant mountains while nobody was watching.\n"],
    ["raw/2023-06-17 The Savage Needs Unhappiness.md","The forgotten garden wandered toward an unfinished sentence in the middle of spring.\n"],
    ["raw/2023-06-25 We All Have Separation Anxiety.md","A wandering cloud slowly circled the hum of the city for no particular reason.\n"],
    ["raw/2023-06-25 What Kind of Parent Will I Be.md","An old notebook quietly remembered the blue hour while nobody was watching.\n"],
    ["raw/2023-07-21 The Best Here.md","The empty library glowed faintly over a forgotten staircase for no particular reason.\n"],
    ["raw/2023-07-26 Like When We Were Young.md","A paper lantern hummed softly near the winter window as the kettle began to sing.\n"],
    ["raw/2023-07-31 Music of Those Days.md","An old notebook whispered something to a forgotten staircase while nobody was watching.\n"],
    ["raw/2023-08-06 Consistently Kind People.md","A folded letter drifted past the sleeping harbor for no particular reason.\n"],
    ["raw/2023-08-17 Wanting to Do Well.md","A small comet rested beneath the edge of the map while nobody was watching.\n"],
    ["raw/2023-08-19 Swing and Seesaw.md","A small comet waited patiently beside a jar of fireflies just before the rain.\n"],
    ["raw/2023-08-24 The Duty to Grow and the Right to Fail.md","A borrowed umbrella whispered something to a field of sunflowers as the kettle began to sing.\n"],
    ["raw/2023-08-25 Scattered Thoughts and Four More.md","A wandering cloud waited patiently beside an open door as the kettle began to sing.\n"],
    ["raw/2023-08-30 Time Is Short and Fast.md","An old notebook whispered something to a field of sunflowers in the middle of spring.\n"],
    ["raw/2023-09-19 Love Is Active Concern.md","A small comet leaned against the winter window as the kettle began to sing.\n"],
    ["raw/2023-09-20 I See Myself in You.md","A folded letter hummed softly near the winter window in the middle of spring.\n"],
    ["raw/2023-09-20 In Search of a Better Drink.md","A paper lantern spun lazily around the evening tide long after midnight.\n"],
    ["raw/2023-09-20 New Recruits.md","The quiet river wandered toward an open door on a slow Sunday.\n"],
    ["raw/2023-09-20 Paying Time for Fun.md","A rusty bicycle leaned against the hum of the city on a slow Sunday.\n"],
    ["raw/2023-10-07 What Kind of Person Are You.md","A borrowed umbrella rested beneath an unfinished sentence long after midnight.\n"],
    ["raw/2023-10-09 Sensitive Period of Inspiration.md","A paper lantern leaned against a field of sunflowers as the kettle began to sing.\n"],
    ["raw/2023-10-11 Craving Egg Rice.md","The lighthouse keeper slowly circled the edge of the map for no particular reason.\n"],
    ["raw/2023-10-11 Mothers Piano.md","The tired clockmaker slowly circled the evening tide on a slow Sunday.\n"],
    ["raw/2023-10-11 Trigger Button.md","The tired clockmaker lingered by the winter window while nobody was watching.\n"],
    ["raw/2023-10-12 A Person with Thick Fences.md","A cracked teacup lingered by a crowded market as the kettle began to sing.\n"],
    ["raw/2023-10-12 Nonsense.md","A paper lantern slowly circled a field of sunflowers on a slow Sunday.\n"],
    ["raw/2023-10-12 We Fall in Love on Insufficient Data.md","The tired clockmaker quietly remembered the winter window long after midnight.\n"],
    ["raw/2023-10-15 Reality Soundtrack.md","A stray melody rested beneath a pile of autumn leaves long after midnight.\n"],
    ["raw/2023-10-15 The Counselor Says.md","An old notebook waited patiently beside the evening tide in the middle of spring.\n"],
    ["raw/2023-10-20 Catfish.md","A stray melody drifted past the sleeping harbor without saying a word.\n"],
    ["raw/2023-10-25 Cynical Thoughts.md","A paper lantern spun lazily around the winter window just before the rain.\n"],
    ["raw/2023-10-27 The Counselor Says 2.md","A rusty bicycle rested beneath a forgotten staircase in the middle of spring.\n"],
    ["raw/2023-10-27 The Counselor Says Again.md","The tired clockmaker drifted past a field of sunflowers on a slow Sunday.\n"],
    ["raw/2023-11-04 Ghost in the Shell.md","A paper lantern rested beneath the sleeping harbor without saying a word.\n"],
    ["raw/2023-11-15 Lets Worship Evil.md","The tired clockmaker quietly remembered the blue hour just before the rain.\n"],
    ["raw/2023-11-19 Digging and Recalling.md","An old notebook slowly circled a crowded market while nobody was watching.\n"],
    ["raw/2023-11-21 The Counselor Says 3.md","The morning train leaned against the hum of the city in the middle of spring.\n"],
    ["raw/2023-11-21 Why Nonsmokers Should Carry a Lighter.md","The lighthouse keeper hummed softly near the evening tide as the kettle began to sing.\n"],
    ["raw/2023-11-29 Best Beer Memoir.md","The last bus glowed faintly over the sleeping harbor just before the rain.\n"],
    ["raw/2023-11-29 Trusting Finite Time 2.md","A paper lantern hummed softly near a jar of fireflies just before the rain.\n"],
    ["raw/2023-12-05 Microhabitat.md","A folded letter glowed faintly over the hum of the city as the kettle began to sing.\n"],
    ["raw/2023-12-05 Reading Schopenhauer.md","A stray melody quietly remembered the hum of the city on a slow Sunday.\n"],
    ["raw/2023-12-06 The Counselor Says 4.md","A wandering cloud drifted past a jar of fireflies for no particular reason.\n"],
    ["raw/2023-12-13 A God Visits Everyone Once.md","The neighbor's cat hummed softly near a jar of fireflies for no particular reason.\n"],
    ["raw/2023-12-16 In a Dream.md","The lighthouse keeper slowly circled a jar of fireflies as the kettle began to sing.\n"],
    ["raw/2023-12-16 Wounds Should Hurt.md","The neighbor's cat drifted past the evening tide as the kettle began to sing.\n"],
    ["raw/2023-12-18 Maxims of the Year.md","A wandering cloud leaned against the winter window on a slow Sunday.\n"],
    ["raw/2023-12-22 Books of the Year.md","The lighthouse keeper lingered by the hum of the city without saying a word.\n"],
    ["raw/2023-12-22 Climbing Out of the Pit Fast.md","The tired clockmaker leaned against the sleeping harbor on a slow Sunday.\n"],
    ["raw/2023-12-22 Selfish Relationships.md","The midnight bakery whispered something to the distant mountains on a slow Sunday.\n"],
    ["raw/2023-12-22 This Year Was.md","A stray melody leaned against the evening tide in the middle of spring.\n"],
    ["raw/2023-12-22 Top Three Moments.md","A stray melody quietly remembered an open door long after midnight.\n"],
    ["raw/2023-12-22 Year End Prep.md","An old notebook waited patiently beside an open door in the middle of spring.\n"],
    ["raw/2023-12-25 Sentence of the Year.md","A wandering cloud whispered something to an unfinished sentence long after midnight.\n"],
    ["raw/2023-12-28 Daytime Moon.md","An old notebook lingered by the blue hour while nobody was watching.\n"],
    ["raw/2023-12-28 On a Favorite Author.md","A small comet rested beneath the evening tide as the kettle began to sing.\n"],
    ["raw/2024-01-05 Drinking Alone.md","The lighthouse keeper glowed faintly over a field of sunflowers without saying a word.\n"],
    ["raw/2024-01-07 Falling into Inertia.md","A folded letter spun lazily around a jar of fireflies on a slow Sunday.\n"],
    ["raw/2024-01-12 Sensitivity.md","The empty library rested beneath the winter window in the middle of spring.\n"],
    ["raw/2024-01-15 A Drama and Eternal Return.md","The tired clockmaker quietly remembered an unfinished sentence in the middle of spring.\n"],
    ["raw/2024-01-15 Fire Gazing.md","A folded letter glowed faintly over a forgotten staircase long after midnight.\n"],
    ["raw/2024-01-25 Swimmer Underwater.md","A wandering cloud spun lazily around a forgotten staircase just before the rain.\n"],
    ["raw/2024-02-03 Clouds and Rain Are Reliable.md","The empty library glowed faintly over the distant mountains while nobody was watching.\n"],
    ["raw/2024-02-05 Unbearable Lightness.md","The empty library slowly circled an unfinished sentence in the middle of spring.\n"],
    ["raw/2024-02-12 Dream - Old Man and a Shout.md","A folded letter wandered toward a pile of autumn leaves for no particular reason.\n"],
    ["raw/2024-02-23 Night.md","A cracked teacup rested beneath a pile of autumn leaves just before the rain.\n"],
    ["raw/2024-03-06 Several Characters.md","A borrowed umbrella slowly circled the distant mountains without saying a word.\n"],
    ["raw/2024-03-19 Distance.md","A borrowed umbrella hummed softly near the evening tide long after midnight.\n"],
    ["raw/2024-05-06 Everything in Its Place.md","The neighbor's cat hummed softly near the edge of the map while nobody was watching.\n"],
    ["raw/2024-05-13 No One Beats the Market.md","An old notebook hummed softly near a pile of autumn leaves on a slow Sunday.\n"],
    ["raw/2024-05-16 Busy Busy.md","A rusty bicycle glowed faintly over the evening tide as the kettle began to sing.\n"],
    ["raw/2024-05-18 Unguaranteed Constancy.md","A wandering cloud wandered toward the blue hour as the kettle began to sing.\n"],
    ["raw/2024-05-28 A Silly Dilemma.md","A small comet wandered toward the sleeping harbor as the kettle began to sing.\n"],
    ["raw/2024-05-28 Separating Lyrics from Melody.md","The morning train glowed faintly over an unfinished sentence just before the rain.\n"],
    ["raw/2024-05-28 Trainee.md","The morning train wandered toward the edge of the map for no particular reason.\n"],
    ["raw/2024-05-28 Values Auction.md","A paper lantern spun lazily around a forgotten staircase while nobody was watching.\n"],
    ["raw/2024-06-10 Happy When Scribbling.md","A small comet rested beneath an open door without saying a word.\n"],
    ["raw/2024-06-22 Stay Humble Stay Diligent.md","A rusty bicycle whispered something to a jar of fireflies in the middle of spring.\n"],
    ["raw/2024-07-06 Investment Journal.md","A rusty bicycle slowly circled the hum of the city as the kettle began to sing.\n"],
    ["raw/2024-07-06 Take Care Not to Be Forgotten.md","The tired clockmaker wandered toward the edge of the map for no particular reason.\n"],
    ["raw/2024-07-14 Investment Journal.md","A stray melody rested beneath a pile of autumn leaves as the kettle began to sing.\n"],
    ["raw/2024-07-21 Investment Journal.md","The neighbor's cat slowly circled a crowded market without saying a word.\n"],
    ["raw/2024-07-21 Pastoral Life.md","A stray melody wandered toward a field of sunflowers long after midnight.\n"],
    ["raw/2024-07-28 Passport Photo Day.md","The tired clockmaker waited patiently beside the edge of the map just before the rain.\n"],
    ["raw/2024-07-28 Picking Up the Passport.md","The neighbor's cat glowed faintly over a forgotten staircase just before the rain.\n"],
    ["raw/2024-07-28 Why I Quit Social Media.md","A cracked teacup waited patiently beside the blue hour in the middle of spring.\n"],
    ["raw/2024-08-08 Sand or Stone Both Sink.md","A folded letter rested beneath a pile of autumn leaves in the middle of spring.\n"],
    ["raw/2024-08-17 Counting Earthworms.md","An old notebook hummed softly near a jar of fireflies in the middle of spring.\n"],
    ["raw/2024-08-20 Leave It to the Experts.md","A wandering cloud whispered something to a forgotten staircase while nobody was watching.\n"],
    ["raw/2024-08-25 Image and Attraction.md","A wandering cloud wandered toward the sleeping harbor without saying a word.\n"],
    ["raw/2024-08-26 High Rise Spider.md","The empty library glowed faintly over a jar of fireflies in the middle of spring.\n"],
    ["raw/2024-08-27 Childhood Cartoons and Homework.md","The tired clockmaker lingered by a forgotten staircase as the kettle began to sing.\n"],
    ["raw/2024-08-28 Even If the Marlin Is Eaten.md","The forgotten garden hummed softly near the winter window in the middle of spring.\n"],
    ["raw/2024-08-29 Cattails.md","The forgotten garden drifted past the blue hour without saying a word.\n"],
    ["raw/2024-08-30 That Can Happen.md","A wandering cloud lingered by the edge of the map for no particular reason.\n"],
    ["raw/2024-08-31 Kitsch.md","A paper lantern whispered something to the distant mountains while nobody was watching.\n"],
    ["raw/2024-09-02 The Era of Indoor Smoking.md","A wandering cloud whispered something to an open door while nobody was watching.\n"],
    ["raw/2024-09-04 Mom.md","A borrowed umbrella spun lazily around the blue hour just before the rain.\n"],
    ["raw/2024-09-04 No More Calls for Fun.md","A rusty bicycle quietly remembered the sleeping harbor long after midnight.\n"],
    ["raw/2024-09-05 Sponge Cake.md","A wandering cloud leaned against an unfinished sentence for no particular reason.\n"],
    ["raw/2024-09-06 My Right Temperature.md","A folded letter leaned against the hum of the city in the middle of spring.\n"],
    ["raw/2024-09-06 The Eldest.md","A stray melody glowed faintly over the winter window on a slow Sunday.\n"],
    ["raw/2024-09-07 Anachronism.md","The forgotten garden drifted past a forgotten staircase while nobody was watching.\n"],
    ["raw/2024-09-08 Mint Toothpaste.md","The lighthouse keeper hummed softly near the evening tide on a slow Sunday.\n"],
    ["raw/2024-09-08 Neurosis.md","An old notebook drifted past an unfinished sentence as the kettle began to sing.\n"],
    ["raw/2024-09-09 What Is Love.md","The quiet river whispered something to the edge of the map as the kettle began to sing.\n"],
    ["raw/2024-09-12 Unhappiness Comes from Not Being Alone.md","A paper lantern wandered toward the evening tide on a slow Sunday.\n"],
    ["raw/2024-09-13 Lucky with People.md","A cracked teacup wandered toward a forgotten staircase long after midnight.\n"],
    ["raw/2024-09-14 Carrying the Wrong Impulse.md","The empty library whispered something to the evening tide in the middle of spring.\n"],
    ["raw/2024-09-14 Heat of Evaporation.md","The lighthouse keeper quietly remembered an open door on a slow Sunday.\n"],
    ["raw/2024-09-14 Like a Ball Rolling Downhill.md","The last bus slowly circled a field of sunflowers while nobody was watching.\n"],
    ["raw/2024-09-29 Twice as Sensitive.md","A wandering cloud lingered by an unfinished sentence on a slow Sunday.\n"],
    ["raw/2024-10-14 Investment Journal.md","The neighbor's cat waited patiently beside a forgotten staircase long after midnight.\n"],
    ["raw/2024-10-27 Encounters.md","The morning train whispered something to the hum of the city while nobody was watching.\n"],
    ["raw/2024-11-05 Once Is Never.md","The lighthouse keeper rested beneath the blue hour without saying a word.\n"],
    ["raw/2024-11-22 Investment Journal.md","A borrowed umbrella rested beneath the evening tide without saying a word.\n"],
    ["raw/2024-12-07 Investment Journal.md","The quiet river glowed faintly over a jar of fireflies for no particular reason.\n"],
    ["raw/2024-12-15 Endlessly.md","The morning train glowed faintly over a crowded market for no particular reason.\n"],
    ["raw/2024-12-17 Investment Journal.md","A paper lantern glowed faintly over the edge of the map long after midnight.\n"],
    ["raw/2024-12-22 Christmas.md","The tired clockmaker wandered toward a pile of autumn leaves in the middle of spring.\n"],
    ["raw/2025-01-07 Last Day of the Christmas Market.md","A stray melody leaned against a jar of fireflies as the kettle began to sing.\n"],
    ["raw/2025-01-08 Night Sky.md","A borrowed umbrella slowly circled a pile of autumn leaves as the kettle began to sing.\n"],
    ["raw/2025-01-09 Hard Things.md","A rusty bicycle whispered something to an open door in the middle of spring.\n"],
    ["raw/2025-01-10 Summer.md","A folded letter drifted past a pile of autumn leaves without saying a word.\n"],
    ["raw/2025-01-22 Investment Journal.md","The last bus wandered toward an unfinished sentence without saying a word.\n"],
    ["raw/2025-01-26 What the Captain Said.md","A stray melody leaned against the winter window long after midnight.\n"],
    ["raw/2025-01-27 New Year.md","The tired clockmaker drifted past the distant mountains as the kettle began to sing.\n"],
    ["raw/2025-02-09 Homeless.md","A borrowed umbrella hummed softly near a forgotten staircase in the middle of spring.\n"],
    ["raw/2025-03-20 Supply and Demand.md","The forgotten garden rested beneath the hum of the city as the kettle began to sing.\n"],
    ["raw/2025-03-29 The Illusion of Busyness.md","The forgotten garden spun lazily around a forgotten staircase for no particular reason.\n"],
    ["raw/2025-05-21 Just Because.md","A rusty bicycle drifted past a field of sunflowers long after midnight.\n"],
    ["raw/2025-06-01 Big Mountain.md","The neighbor's cat glowed faintly over a forgotten staircase as the kettle began to sing.\n"],
    ["raw/2025-06-19 Investment Journal.md","The empty library spun lazily around an open door without saying a word.\n"],
    ["raw/2025-07-06 Investment Journal.md","The forgotten garden rested beneath the distant mountains without saying a word.\n"],
    ["raw/2025-07-19 Investment Journal.md","The midnight bakery lingered by the distant mountains without saying a word.\n"],
    ["raw/2025-08-14 Investment Journal.md","The lighthouse keeper lingered by a pile of autumn leaves long after midnight.\n"],
    ["raw/2025-08-17 Arrived Uniquely Left Ordinarily.md","The empty library slowly circled an unfinished sentence on a slow Sunday.\n"],
    ["raw/2025-09-26 Investment Journal.md","A cracked teacup leaned against a field of sunflowers just before the rain.\n"],
    ["raw/2025-10-04 Happiness Threshold.md","A cracked teacup hummed softly near a forgotten staircase for no particular reason.\n"],
    ["raw/2025-10-18 Riding Along.md","A stray melody lingered by an open door long after midnight.\n"],
    ["raw/2025-10-22 Investment Journal.md","The morning train hummed softly near the winter window as the kettle began to sing.\n"],
    ["raw/2025-10-25 Simplicity Is Truths Youngest Face.md","The lighthouse keeper quietly remembered the winter window while nobody was watching.\n"],
    ["raw/2025-11-02 As a Butterfly Knows a Day as Forever.md","The tired clockmaker quietly remembered the winter window while nobody was watching.\n"],
    ["raw/2025-11-13 June Fifth.md","An old notebook rested beneath the winter window just before the rain.\n"],
    ["raw/2025-11-20 Wandering Is Youths Privilege.md","The forgotten garden waited patiently beside a jar of fireflies while nobody was watching.\n"],
    ["raw/2025-11-22 Not a Speck of Shame.md","The empty library wandered toward a pile of autumn leaves for no particular reason.\n"],
    ["raw/2025-11-26 Twenty Nine.md","A folded letter quietly remembered the sleeping harbor long after midnight.\n"],
    ["raw/2025-11-30 Practicing Living Today.md","The forgotten garden waited patiently beside a jar of fireflies on a slow Sunday.\n"],
    ["raw/2025-12-08 First Snow.md","A wandering cloud wandered toward a field of sunflowers while nobody was watching.\n"],
    ["raw/2025-12-12 Investment Journal.md","A borrowed umbrella hummed softly near a field of sunflowers in the middle of spring.\n"],
    ["raw/2025-12-12 New People in New Places.md","A paper lantern quietly remembered the hum of the city long after midnight.\n"],
    ["raw/2025-12-23 A Characters Sense of Justice.md","The neighbor's cat rested beneath the blue hour for no particular reason.\n"],
    ["raw/2026-01-01 New Year Address.md","The morning train hummed softly near the evening tide as the kettle began to sing.\n"],
    ["raw/2026-01-01 Twenty One.md","The empty library whispered something to an open door while nobody was watching.\n"],
    ["raw/2026-01-01 Year in Review.md","A rusty bicycle slowly circled a jar of fireflies in the middle of spring.\n"],
    ["raw/2026-01-06 Quitting Drinking.md","A stray melody spun lazily around a field of sunflowers just before the rain.\n"],
    ["raw/2026-01-08 Investment Journal.md","The last bus drifted past the blue hour for no particular reason.\n"],
    ["raw/2026-01-08 What Outsiders Dont Know.md","The neighbor's cat quietly remembered the distant mountains on a slow Sunday.\n"],
    ["raw/2026-01-13 Lightness Heaviness Synthesis.md","The forgotten garden slowly circled the sleeping harbor as the kettle began to sing.\n"],
    ["raw/2026-01-18 Grandfather.md","The empty library lingered by the winter window for no particular reason.\n"],
    ["raw/2026-02-04 Brave New World Notes.md","A borrowed umbrella spun lazily around an unfinished sentence long after midnight.\n"],
    ["raw/2026-02-07 A Small Cafe.md","A cracked teacup glowed faintly over a field of sunflowers as the kettle began to sing.\n"],
    ["raw/2026-02-07 The City Is Too Big.md","A paper lantern slowly circled a jar of fireflies just before the rain.\n"],
    ["raw/2026-02-10 Investment Journal.md","A borrowed umbrella drifted past the edge of the map long after midnight.\n"],
    ["raw/2026-02-26 Nostalgia.md","The empty library wandered toward a field of sunflowers for no particular reason.\n"],
    ["raw/2026-03-12 Flea Market Fashion over Luxury.md","The empty library lingered by the blue hour long after midnight.\n"],
    ["raw/2026-03-25 Spring.md","A small comet rested beneath a pile of autumn leaves for no particular reason.\n"],
    ["raw/2026-05-11 Investment Journal.md","A borrowed umbrella whispered something to the sleeping harbor in the middle of spring.\n"],
    ["raw/2026-05-23 On Writing.md","A folded letter whispered something to the winter window while nobody was watching.\n"],
    ["raw/2026-06-02 Investment Journal.md","A borrowed umbrella hummed softly near the evening tide while nobody was watching.\n"],
    ["raw/2026-06-19 What Are We Leaving Students.md","A stray melody whispered something to the sleeping harbor just before the rain.\n"],
    ["raw/2026-07-20 Investment Journal.md","The forgotten garden rested beneath the evening tide for no particular reason.\n"],
    ["raw/2026-08-30 A Precious Person.md","A stray melody quietly remembered an open door in the middle of spring.\n"],
    ["raw/Baek - A Quiet Incident.md","The forgotten garden drifted past the edge of the map without saying a word.\n"],
    ["raw/Baek - Trajectory of Time.md","The morning train wandered toward a field of sunflowers for no particular reason.\n"],
    ["raw/Bogle - The Little Book of Common Sense Investing.md","The empty library spun lazily around the distant mountains just before the rain.\n"],
    ["raw/Carnegie - How to Win Friends.md","A cracked teacup whispered something to the distant mountains just before the rain.\n"],
    ["raw/Chekhov - The Darling.md","A folded letter spun lazily around a forgotten staircase for no particular reason.\n"],
    ["raw/Cho - Living Room Art Museum.md","A stray melody spun lazily around the sleeping harbor for no particular reason.\n"],
    ["raw/Choi - Frame.md","The midnight bakery lingered by the winter window for no particular reason.\n"],
    ["raw/Choi - Shokos Smile.md","A borrowed umbrella wandered toward a crowded market long after midnight.\n"],
    ["raw/Dazai - No Longer Human - Direct Appeal.md","A rusty bicycle rested beneath the edge of the map in the middle of spring.\n"],
    ["raw/Dazai - No Longer Human.md","The midnight bakery wandered toward a pile of autumn leaves as the kettle began to sing.\n"],
    ["raw/de Botton - Essays in Love.md","The neighbor's cat spun lazily around the evening tide long after midnight.\n"],
    ["raw/de Botton - The Course of Love.md","The tired clockmaker drifted past an open door on a slow Sunday.\n"],
    ["raw/Diez - A Philosophical Guide to Loves Errors.md","A wandering cloud slowly circled the sleeping harbor while nobody was watching.\n"],
    ["raw/Ende - Momo.md","The neighbor's cat whispered something to the blue hour as the kettle began to sing.\n"],
    ["raw/Fitzgerald - The Great Gatsby.md","The midnight bakery leaned against a crowded market on a slow Sunday.\n"],
    ["raw/Frankl - Mans Search for Meaning.md","The quiet river lingered by the edge of the map in the middle of spring.\n"],
    ["raw/Guerrilla Girls - No Such Woman.md","A folded letter waited patiently beside the hum of the city in the middle of spring.\n"],
    ["raw/Hansen - The Insta Brain.md","A borrowed umbrella leaned against a jar of fireflies in the middle of spring.\n"],
    ["raw/Hemingway - The Old Man and the Sea.md","The neighbor's cat lingered by a field of sunflowers in the middle of spring.\n"],
    ["raw/Housel - The Psychology of Money.md","A folded letter rested beneath the winter window while nobody was watching.\n"],
    ["raw/Huxley - Brave New World.md","A rusty bicycle quietly remembered a forgotten staircase long after midnight.\n"],
    ["raw/Ichijo - Even If This Love Disappears Tonight.md","The forgotten garden whispered something to the edge of the map as the kettle began to sing.\n"],
    ["raw/Jeon - Sorry for Being Born.md","A rusty bicycle spun lazily around the winter window for no particular reason.\n"],
    ["raw/Kim - If We Cannot Move at Light Speed.md","The morning train drifted past the evening tide as the kettle began to sing.\n"],
    ["raw/Kim - Its Okay to Be Uncomfortable.md","The midnight bakery drifted past an unfinished sentence without saying a word.\n"],
    ["raw/Kim - Mremosa.md","The empty library wandered toward a forgotten staircase for no particular reason.\n"],
    ["raw/Kim - Playlist.md","The morning train wandered toward a field of sunflowers just before the rain.\n"],
    ["raw/Kim - The Compulsions We Live With.md","The tired clockmaker glowed faintly over a field of sunflowers as the kettle began to sing.\n"],
    ["raw/Kim - The Secret of Teen Angst.md","The last bus slowly circled the distant mountains while nobody was watching.\n"],
    ["raw/Kim - The Uncomfortable Convenience Store.md","The forgotten garden lingered by the winter window long after midnight.\n"],
    ["raw/Kim - The Vessel of Words.md","A cracked teacup slowly circled the distant mountains just before the rain.\n"],
    ["raw/Kim - When Pain Becomes a Path.md","The forgotten garden spun lazily around a pile of autumn leaves while nobody was watching.\n"],
    ["raw/Kleinbaum - Dead Poets Society.md","A rusty bicycle waited patiently beside a crowded market long after midnight.\n"],
    ["raw/Lee - Easy Science Book.md","The empty library leaned against a crowded market in the middle of spring.\n"],
    ["raw/Lee - Resting the Heart on Paintings.md","A wandering cloud whispered something to the evening tide as the kettle began to sing.\n"],
    ["raw/Lee - The Dallergut Dream Department Store.md","The last bus quietly remembered the edge of the map on a slow Sunday.\n"],
    ["raw/Lee - The Temperature of Language.md","A paper lantern hummed softly near the distant mountains in the middle of spring.\n"],
    ["raw/Miller - Why Fish Dont Exist.md","A borrowed umbrella slowly circled the hum of the city in the middle of spring.\n"],
    ["raw/Moon - Different.md","A rusty bicycle leaned against a jar of fireflies as the kettle began to sing.\n"],
    ["raw/Murakami - Sleep.md","A paper lantern wandered toward the distant mountains for no particular reason.\n"],
    ["raw/Murakami - The Wind-Up Bird Chronicle 1.md","The lighthouse keeper leaned against the distant mountains in the middle of spring.\n"],
    ["raw/Musso - Because I Love You.md","A small comet drifted past the evening tide for no particular reason.\n"],
    ["raw/Oi - What the Elderly with Dementia See.md","The morning train spun lazily around a forgotten staircase on a slow Sunday.\n"],
    ["raw/Park - A Grain of Truth.md","A wandering cloud glowed faintly over the evening tide just before the rain.\n"],
    ["raw/Park - Crime of Spreading Truth.md","The midnight bakery drifted past a crowded market for no particular reason.\n"],
    ["raw/Pyo - A Profilers Case Files.md","The morning train hummed softly near the blue hour without saying a word.\n"],
    ["raw/Reiman - The Power of Body Language.md","The empty library hummed softly near the blue hour for no particular reason.\n"],
    ["raw/Roemmers - The Return of the Young Prince.md","The forgotten garden waited patiently beside a pile of autumn leaves without saying a word.\n"],
    ["raw/Sagan - Aimez-vous Brahms.md","The empty library lingered by the winter window while nobody was watching.\n"],
    ["raw/Saint-Exupery - The Little Prince.md","A folded letter whispered something to a forgotten staircase in the middle of spring.\n"],
    ["raw/Salinger - The Catcher in the Rye.md","The last bus leaned against the blue hour for no particular reason.\n"],
    ["raw/Sullivan - What Makes Me Me.md","A paper lantern waited patiently beside a pile of autumn leaves long after midnight.\n"],
    ["raw/Vasconcelos - My Sweet Orange Tree.md","The empty library spun lazily around the blue hour while nobody was watching.\n"],
    ["raw/Wittblum - Why Are Odd People Around Me.md","The empty library lingered by the winter window for no particular reason.\n"],
    ["raw/Yu - How Shall We Live.md","The quiet river drifted past a crowded market while nobody was watching.\n"],
    ["wiki/books/Books and Thinkers.md","The lighthouse keeper hummed softly near the evening tide as the kettle began to sing.\n\n[[Solitude and Loneliness]] [[Weight and Lightness]] [[Love and Relationships]] [[The Course of Love]] [[Art and Aesthetics]] [[Values and Maxims]] [[Time Memory and Finitude]] [[Why Fish Dont Exist]] [[Individuality and Uniformity]] [[Mans Search for Meaning]] [[Sensitivity and Perception]] [[What the Elderly with Dementia See]] [[Minorities and Normality]] [[When Pain Becomes a Path]] [[If We Cannot Move at Light Speed]] [[The Compulsions We Live With]] [[Who I Am]] [[Why Are Odd People Around Me]] [[Ever Since Darwin Made Me]] [[The Insta Brain]] [[Own All the Stocks]] [[Investing Principles]] [[Index vs Single Stocks]] [[The Psychology of Money]] [[Music and Memory]] [[Writing and Self Narrative]] [[My Sweet Orange Tree]]\n"],
    ["wiki/books/entries/fiction/If We Cannot Move at Light Speed.md","The tired clockmaker leaned against a field of sunflowers in the middle of spring.\n\n[[Individuality and Uniformity]] [[Why Fish Dont Exist]] [[When Pain Becomes a Path]] [[Minorities and Normality]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/fiction/My Sweet Orange Tree.md","The morning train wandered toward a field of sunflowers just before the rain.\n\n[[Individuality and Uniformity]] [[Love and Relationships]] [[Who I Am]] [[Weight and Lightness]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/fiction/The Course of Love.md","The neighbor's cat spun lazily around a forgotten staircase in the middle of spring.\n\n[[Love and Relationships]] [[Values and Maxims]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/investing/Own All the Stocks.md","A rusty bicycle leaned against the evening tide long after midnight.\n\n[[Investing Principles]] [[Index vs Single Stocks]] [[The Psychology of Money]] [[Investing Journey Timeline]]\n"],
    ["wiki/books/entries/investing/The Psychology of Money.md","The quiet river slowly circled the distant mountains on a slow Sunday.\n\n[[Investing Principles]] [[Investing Journey Timeline]] [[Own All the Stocks]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/nonfiction/Ever Since Darwin Made Me.md","A stray melody spun lazily around the hum of the city just before the rain.\n\n[[Time Memory and Finitude]] [[Individuality and Uniformity]] [[Who I Am]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/nonfiction/Mans Search for Meaning.md","The last bus slowly circled a jar of fireflies for no particular reason.\n\n[[Sensitivity and Perception]] [[Values and Maxims]] [[Time Memory and Finitude]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/nonfiction/The Compulsions We Live With.md","The midnight bakery quietly remembered an unfinished sentence just before the rain.\n\n[[Who I Am]] [[Values and Maxims]] [[Sensitivity and Perception]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/nonfiction/The Insta Brain.md","The tired clockmaker leaned against the distant mountains long after midnight.\n\n[[Solitude and Loneliness]] [[Sensitivity and Perception]] [[Individuality and Uniformity]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/nonfiction/What the Elderly with Dementia See.md","The empty library lingered by a jar of fireflies without saying a word.\n\n[[Individuality and Uniformity]] [[Who I Am]] [[Time Memory and Finitude]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/nonfiction/When Pain Becomes a Path.md","A paper lantern waited patiently beside the winter window without saying a word.\n\n[[Individuality and Uniformity]] [[Values and Maxims]] [[If We Cannot Move at Light Speed]] [[Minorities and Normality]] [[Why Fish Dont Exist]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/nonfiction/Why Are Odd People Around Me.md","The morning train spun lazily around the evening tide while nobody was watching.\n\n[[Personality Test - Big Five]] [[Values and Maxims]] [[The Compulsions We Live With]] [[Love and Relationships]] [[Books and Thinkers]]\n"],
    ["wiki/books/entries/nonfiction/Why Fish Dont Exist.md","The empty library wandered toward the sleeping harbor without saying a word.\n\n[[Individuality and Uniformity]] [[Time Memory and Finitude]] [[Sensitivity and Perception]] [[When Pain Becomes a Path]] [[Minorities and Normality]] [[Books and Thinkers]]\n"],
    ["wiki/index.md","The forgotten garden slowly circled the hum of the city as the kettle began to sing.\n\n[[Who I Am]] [[Values and Maxims]] [[Personality Test - Big Five]] [[Counseling Notes]] [[Lessons from Service]] [[Chronicle]] [[Lessons from Abroad]] [[Solitude and Loneliness]] [[Weight and Lightness]] [[Sensitivity and Perception]] [[Time Memory and Finitude]] [[Love and Relationships]] [[Art and Aesthetics]] [[Individuality and Uniformity]] [[Minorities and Normality]] [[Views on Education]] [[Writing and Self Narrative]] [[Shifts in Style and Tone]] [[Music and Memory]] [[Technology and Drift]] [[Investing Principles]] [[Index vs Single Stocks]] [[Investing Journey Timeline]] [[Books and Thinkers]]\n"],
    ["wiki/investments/Index vs Single Stocks.md","A wandering cloud spun lazily around a crowded market on a slow Sunday.\n\n[[Investing Journey Timeline]] [[Investing Principles]] [[Values and Maxims]] [[Who I Am]]\n"],
    ["wiki/investments/Investing Journey Timeline.md","The neighbor's cat wandered toward the sleeping harbor without saying a word.\n\n[[Index vs Single Stocks]] [[Investing Principles]] [[Values and Maxims]] [[Who I Am]]\n"],
    ["wiki/investments/Investing Principles.md","The neighbor's cat spun lazily around a field of sunflowers for no particular reason.\n\n[[Investing Journey Timeline]] [[Index vs Single Stocks]] [[Love and Relationships]] [[Who I Am]] [[Values and Maxims]]\n"],
    ["wiki/psych/Chronicle.md","A paper lantern glowed faintly over the evening tide on a slow Sunday.\n\n[[Who I Am]] [[Time Memory and Finitude]] [[Writing and Self Narrative]] [[Shifts in Style and Tone]] [[Minorities and Normality]] [[Sensitivity and Perception]] [[Counseling Notes]] [[Lessons from Service]] [[Views on Education]] [[Values and Maxims]] [[Solitude and Loneliness]] [[Individuality and Uniformity]] [[Lessons from Abroad]] [[Love and Relationships]] [[Investing Journey Timeline]] [[Weight and Lightness]] [[Personality Test - Big Five]] [[Technology and Drift]] [[Investing Principles]]\n"],
    ["wiki/psych/Counseling Notes.md","The tired clockmaker quietly remembered the blue hour for no particular reason.\n\n[[Personality Test - Big Five]] [[Sensitivity and Perception]] [[Who I Am]] [[Solitude and Loneliness]] [[Love and Relationships]] [[Time Memory and Finitude]] [[Values and Maxims]] [[Individuality and Uniformity]] [[Lessons from Service]] [[Lessons from Abroad]]\n"],
    ["wiki/psych/Lessons from Abroad.md","The forgotten garden whispered something to the blue hour long after midnight.\n\n[[Lessons from Service]] [[Weight and Lightness]] [[Solitude and Loneliness]] [[Counseling Notes]] [[Who I Am]] [[Love and Relationships]] [[Values and Maxims]] [[Minorities and Normality]] [[Time Memory and Finitude]] [[Technology and Drift]] [[Individuality and Uniformity]]\n"],
    ["wiki/psych/Lessons from Service.md","A paper lantern drifted past the sleeping harbor long after midnight.\n\n[[Counseling Notes]] [[Lessons from Abroad]] [[Views on Education]] [[Values and Maxims]] [[Who I Am]] [[Minorities and Normality]] [[Sensitivity and Perception]] [[Shifts in Style and Tone]] [[Solitude and Loneliness]] [[Time Memory and Finitude]] [[Weight and Lightness]]\n"],
    ["wiki/psych/Personality Test - Big Five.md","The lighthouse keeper spun lazily around a forgotten staircase in the middle of spring.\n\n[[Sensitivity and Perception]] [[Values and Maxims]] [[Solitude and Loneliness]] [[Art and Aesthetics]] [[Writing and Self Narrative]] [[Love and Relationships]] [[Who I Am]] [[Counseling Notes]]\n"],
    ["wiki/psych/Values and Maxims.md","The empty library spun lazily around the blue hour on a slow Sunday.\n\n[[Who I Am]] [[Music and Memory]] [[Weight and Lightness]] [[Writing and Self Narrative]] [[Art and Aesthetics]] [[Investing Principles]] [[Lessons from Abroad]] [[Counseling Notes]] [[Index vs Single Stocks]] [[Minorities and Normality]] [[Time Memory and Finitude]] [[Sensitivity and Perception]] [[Love and Relationships]] [[Solitude and Loneliness]] [[Personality Test - Big Five]] [[Lessons from Service]] [[Individuality and Uniformity]] [[Technology and Drift]]\n"],
    ["wiki/psych/Who I Am.md","The forgotten garden waited patiently beside a field of sunflowers as the kettle began to sing.\n\n[[Writing and Self Narrative]] [[Time Memory and Finitude]] [[Individuality and Uniformity]] [[Values and Maxims]] [[Technology and Drift]] [[Lessons from Abroad]] [[Sensitivity and Perception]] [[Music and Memory]] [[Lessons from Service]] [[Shifts in Style and Tone]] [[Counseling Notes]] [[Love and Relationships]] [[Personality Test - Big Five]] [[Books and Thinkers]] [[The Compulsions We Live With]] [[Ever Since Darwin Made Me]] [[Why Are Odd People Around Me]] [[Solitude and Loneliness]]\n"],
    ["wiki/writings/Art and Aesthetics.md","The morning train spun lazily around a jar of fireflies while nobody was watching.\n\n[[Sensitivity and Perception]] [[Values and Maxims]] [[Shifts in Style and Tone]] [[Who I Am]] [[Solitude and Loneliness]] [[Writing and Self Narrative]] [[Music and Memory]] [[Individuality and Uniformity]] [[Books and Thinkers]] [[Chronicle]]\n"],
    ["wiki/writings/Individuality and Uniformity.md","An old notebook lingered by a crowded market as the kettle began to sing.\n\n[[Views on Education]] [[Minorities and Normality]] [[Sensitivity and Perception]] [[Values and Maxims]] [[Writing and Self Narrative]] [[Who I Am]] [[Technology and Drift]] [[Lessons from Abroad]] [[Chronicle]]\n"],
    ["wiki/writings/Love and Relationships.md","A borrowed umbrella rested beneath an unfinished sentence as the kettle began to sing.\n\n[[Solitude and Loneliness]] [[Personality Test - Big Five]] [[Music and Memory]] [[Shifts in Style and Tone]] [[Time Memory and Finitude]] [[Counseling Notes]] [[Lessons from Abroad]] [[Investing Principles]] [[Books and Thinkers]] [[Who I Am]] [[Chronicle]]\n"],
    ["wiki/writings/Minorities and Normality.md","The neighbor's cat leaned against the hum of the city just before the rain.\n\n[[Individuality and Uniformity]] [[Why Fish Dont Exist]] [[When Pain Becomes a Path]] [[If We Cannot Move at Light Speed]] [[Books and Thinkers]] [[Sensitivity and Perception]] [[Values and Maxims]] [[Chronicle]]\n"],
    ["wiki/writings/Music and Memory.md","A paper lantern drifted past a crowded market as the kettle began to sing.\n\n[[Who I Am]] [[Time Memory and Finitude]] [[Art and Aesthetics]] [[Lessons from Service]] [[Books and Thinkers]] [[Writing and Self Narrative]] [[Chronicle]]\n"],
    ["wiki/writings/Sensitivity and Perception.md","A paper lantern rested beneath the winter window just before the rain.\n\n[[Solitude and Loneliness]] [[Counseling Notes]] [[Art and Aesthetics]] [[Individuality and Uniformity]] [[Writing and Self Narrative]] [[Personality Test - Big Five]] [[Values and Maxims]] [[Who I Am]] [[Chronicle]]\n"],
    ["wiki/writings/Shifts in Style and Tone.md","The neighbor's cat quietly remembered the hum of the city as the kettle began to sing.\n\n[[Writing and Self Narrative]] [[Views on Education]] [[Values and Maxims]] [[Music and Memory]] [[Time Memory and Finitude]] [[Who I Am]] [[Minorities and Normality]] [[Lessons from Service]] [[Art and Aesthetics]] [[Solitude and Loneliness]] [[Chronicle]]\n"],
    ["wiki/writings/Solitude and Loneliness.md","A rusty bicycle wandered toward an unfinished sentence without saying a word.\n\n[[Counseling Notes]] [[Books and Thinkers]] [[Individuality and Uniformity]] [[The Insta Brain]] [[Lessons from Abroad]] [[Time Memory and Finitude]] [[Weight and Lightness]] [[Love and Relationships]] [[Who I Am]] [[Lessons from Service]] [[Chronicle]]\n"],
    ["wiki/writings/Technology and Drift.md","The morning train wandered toward a field of sunflowers as the kettle began to sing.\n\n[[Weight and Lightness]] [[The Insta Brain]] [[Solitude and Loneliness]] [[Individuality and Uniformity]] [[Time Memory and Finitude]] [[Who I Am]] [[Shifts in Style and Tone]] [[Writing and Self Narrative]] [[Investing Principles]] [[Values and Maxims]] [[Lessons from Abroad]] [[Sensitivity and Perception]] [[Books and Thinkers]] [[Chronicle]]\n"],
    ["wiki/writings/Time Memory and Finitude.md","The quiet river slowly circled a jar of fireflies just before the rain.\n\n[[Solitude and Loneliness]] [[Love and Relationships]] [[Writing and Self Narrative]] [[Who I Am]] [[Lessons from Service]] [[Values and Maxims]] [[Music and Memory]] [[Books and Thinkers]] [[Lessons from Abroad]] [[Why Fish Dont Exist]] [[Mans Search for Meaning]] [[What the Elderly with Dementia See]] [[Weight and Lightness]] [[Technology and Drift]] [[Chronicle]]\n"],
    ["wiki/writings/Views on Education.md","The morning train spun lazily around a crowded market without saying a word.\n\n[[Individuality and Uniformity]] [[Minorities and Normality]] [[Art and Aesthetics]] [[Lessons from Service]] [[Counseling Notes]] [[Shifts in Style and Tone]] [[Lessons from Abroad]] [[Chronicle]]\n"],
    ["wiki/writings/Weight and Lightness.md","The quiet river drifted past the hum of the city without saying a word.\n\n[[Books and Thinkers]] [[Values and Maxims]] [[Solitude and Loneliness]] [[Time Memory and Finitude]] [[Lessons from Abroad]] [[Lessons from Service]] [[Chronicle]]\n"],
    ["wiki/writings/Writing and Self Narrative.md","An old notebook glowed faintly over the winter window as the kettle began to sing.\n\n[[Time Memory and Finitude]] [[Values and Maxims]] [[Individuality and Uniformity]] [[Who I Am]] [[Shifts in Style and Tone]] [[Investing Principles]] [[Index vs Single Stocks]] [[Chronicle]]\n"]
  ];

  /* A dated file name is the note's own date, which the parser reads the same
     way from a dropped folder. It also stands in for the file times a host
     would pass, so RECENT WORK and Genesis have something to go on; undated
     notes say nothing rather than claim a false present. */
  function build() {
    return NOTES.map(function (n) {
      var m = /(\d{4})-(\d{2})-(\d{2})/.exec(n[0].split('/').pop());
      var at = m ? Date.UTC(+m[1], +m[2] - 1, +m[3], 12) : 0;
      var body = n[1];
      return {
        path: n[0],
        file: { text: function () { return Promise.resolve(body); } },
        meta: at ? { mtime: at, ctime: at } : undefined
      };
    });
  }

  /* ---- say that it is a sample ----------------------------------------
     A demo that quietly shows made-up notes as though they were yours is a
     demo nobody can trust twice. The line goes on the boot screen, above the
     two buttons, where the choice is actually being made. */
  var NOTE = {
    en: 'Showing a sample vault. Drop your own folder to see yours instead — it is read in this browser and goes nowhere.',
    ko: '샘플 볼트를 보고 있습니다. 직접 만든 폴더를 끌어다 놓으면 당신의 볼트가 그려집니다 — 브라우저 안에서만 읽고 어디로도 보내지 않습니다.',
    ja: 'サンプルのボルトを表示しています。フォルダをドロップすればご自身のものが描かれます — このブラウザ内で読むだけで、どこにも送信しません。',
    zh: '正在显示示例仓库。拖入你自己的文件夹即可查看你的仓库 — 仅在此浏览器中读取，不会发送到任何地方。'
  };

  function lang() {
    var chip = document.querySelector('#blangsel u.on');
    if (chip && chip.dataset && chip.dataset.l && NOTE[chip.dataset.l]) return chip.dataset.l;
    var l = (navigator.language || 'en').toLowerCase();
    if (l.indexOf('ko') === 0) return 'ko';
    if (l.indexOf('ja') === 0) return 'ja';
    if (l.indexOf('zh') === 0) return 'zh';
    return 'en';
  }

  function notice() {
    var pick = document.getElementById('bpick');
    if (!pick || document.getElementById('demo-note')) return;
    var el = document.createElement('div');
    el.id = 'demo-note';
    el.style.cssText = 'margin:10px auto 0;max-width:46em;line-height:1.5;opacity:.72;' +
                       'font-size:13px;color:#9fd8ee;font-family:var(--kr);letter-spacing:.01em;' +
                       'text-transform:none;text-align:center';
    el.textContent = NOTE[lang()];
    pick.parentNode.insertBefore(el, pick.nextSibling);

    /* With a sample behind the boot screen, START is not "begin in empty
       space" any more — it is the fastest way to see the thing working, so it
       becomes the lit button and says what it does. Opening your own folder
       stays one click away as the second choice. */
    var go = document.getElementById('b-go'), folder = document.getElementById('b-folder');
    var GO = { en: '▶ EXPLORE THE SAMPLE', ko: '▶ 샘플 둘러보기', ja: '▶ サンプルを見る', zh: '▶ 浏览示例' };
    function relabel() { if (go) go.textContent = GO[lang()]; }
    /* The engine's own footnote is about starting in empty space, which this
       page no longer does; the sample line above already says the privacy
       half of it. */
    var bnote = document.getElementById('bnote');
    if (bnote) bnote.style.display = 'none';
    if (go && folder) {
      go.classList.remove('alt'); folder.classList.add('alt');
      go.parentNode.insertBefore(go, folder);
      relabel();
    }

    /* The language chips retranslate the page; this line is not part of that
       sweep, so it follows them itself. */
    var sel = document.getElementById('blangsel');
    if (sel) sel.addEventListener('click', function () {
      setTimeout(function () { el.textContent = NOTE[lang()]; relabel(); }, 0);
    });
  }

  /* ---- load it, once the engine is there ------------------------------- */
  var tries = 0;
  (function go() {
    var api = window.vaultOrrery;
    if (!api || typeof api.load !== 'function') {
      if (tries++ < 200) { setTimeout(go, 50); }
      return;
    }
    notice();
    /* Quiet: no loading curtain and no summary toast over the boot screen —
       this vault is scenery, not something the visitor asked for. */
    api.load(build(), 'SAMPLE VAULT', { quiet: true });
  })();
})();
