welcome to the repository for grainstems, a granular synthesizer webapp that is hopefully simple to wrap your head around. 

this app was built using typescript and the [T3 stack](https://create.t3.gg/), which includes nextjs, prisma, and trpc. the granular sample manipulation engine comes from tone.js, which is just a wrapper on the native browser web audio api, so the app should be usable on any web browser. the database is postgresql hosted on railway, and the app itself is hosted on vercel. 

improvements to come include changing the delivery of sound files to use a cdn for faster delivery and adding a record and download feature so users can record and keep the interesting sounds they create.
