Code Inefficiencies:

Logic Repetition:
I implemented an isValidDate function in both the Table and Chart components. This logic could instead be extracted into a utility function, but I didn't want to add any extra files to the base project. Another utility function I could include would be a filtering function based on the dates, as this is used in both the Chart and the Table. I also handled loading state for both the initial request as well as the loading state for when the user is inputting a date, which could be considered repetitive. Some logic can probably be written cleaner - ex. calculating rpd in the table.

Loading State Bug:
Experiencing an occasional bug upon the initial refresh of the page where an outline of the chart and table is visible instead of the intended circular progress bar.

Inline Styling:
Had to incorporate some inline styling due to styles not working when implementing the circular progress bar and rendering images in the chart.

useData Hook:
Noticed that data was rendering very slowly due to calls to useData on every re-render. Instead, I changed useData to only be called upon the initial page load since the data is static anyway.


Styling:
Styling can be improved with more time.