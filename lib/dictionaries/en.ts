// Deliberately not `as const`: the literal types would make every Turkish
// string a type error against the English one.
export const en = {
  meta: {
    title: "Instant Lab — the Next.js 16.3 rendering model, measured",
    description:
      "Suspense, Partial Prerendering, Cache Components and Partial Prefetching, demonstrated with real routes and real timings. Nothing here is simulated.",
  },
  nav: {
    home: "Overview",
    suspense: "Suspense",
    waterfall: "Waterfall",
    cache: "Cache",
    prefetch: "Prefetch",
    migration: "Migration",
    repo: "Source",
  },
  home: {
    eyebrow: "Next.js 16.3",
    title: "The rendering model, measured.",
    lede: "One route can now serve a prerendered shell immediately and stream the rest in behind it. Every number on this site comes from a render that actually happened — real routes, real streaming, timings read off the stream as it arrives.",
    method: {
      title: "How the timings are taken",
      body: "Each demo route carries inline script markers inside its RSC stream: one outside every Suspense boundary, one inside. A marker runs the instant its chunk reaches the browser — before hydration, before React does anything. So what you see is byte arrival, not render completion. Latency is added on the server so the gap is visible at normal speed; the streaming itself is never faked.",
    },
    chaptersTitle: "Five chapters",
    start: "Start with Suspense",
    chapters: {
      suspense: {
        title: "The boundary decides what waits",
        body: "Same page, two routes. One awaits its data at the top, one awaits it inside a Suspense boundary. Watch when each one paints.",
      },
      waterfall: {
        title: "A boundary does not make your queries faster",
        body: "Identical boundaries, different awaits. Sequential costs the sum, parallel costs the slower of the two. The mistake that survives the migration.",
      },
      cache: {
        title: "You mark data cached, not routes dynamic",
        body: "use cache, cacheLife, and the documented thresholds that quietly decide whether your cached content reaches the prerender at all.",
      },
      prefetch: {
        title: "One shell per route, shared by every link",
        body: "What a <Link> actually downloads under Partial Prefetching, measured in real requests and real bytes.",
      },
      migration: {
        title: "Static, dynamic, and everything in between",
        body: "What changed, what breaks quietly, and this app's own build output as the worked example.",
      },
    },
  },
  suspense: {
    eyebrow: "Suspense",
    title: "The boundary decides what waits.",
    lede: "A Suspense boundary defines the fallback shown while async work resolves and the region that can stream independently. UI outside the boundary ships in the first response when it can render without unresolved async work. This React primitive underpins streaming and Partial Prerendering, and its placement determines how much real UI remains available while data loads.",
    demo: {
      title: "Two routes, one difference",
      lede: "Both routes render the same dashboard from the same query, with the same added latency. The only thing that differs is where the data is awaited. Run them and watch when each one appears.",
      blocking: {
        title: "Awaiting at the top",
        caption:
          "The page awaits its data before returning any markup. The top bar, the heading and the filters never read that query, and they wait for it anyway.",
      },
      streaming: {
        title: "Inside a Suspense boundary",
        caption:
          "The shell is sent on the first response and the table streams in behind it, into space the layout already reserved. Nothing shifts when the rows land.",
      },
    },
    code: {
      title: "The only difference",
      blockingCaption: "One await, and the whole page is behind it.",
      streamingCaption:
        "The promise is handed down and awaited inside the boundary instead.",
      note: "Timing markers are omitted from these snippets. Each block names the real file, and each demo pane links to the running route so you can read the streamed HTML yourself.",
    },
    reading: {
      title: "What you just measured",
      body1:
        "In the blocking route, all three markers land at roughly the same moment. That is not a rounding artefact — the server held the entire response until the query resolved, so the shell, the data and the load event genuinely arrived together. The header was ready in single-digit milliseconds and waited anyway.",
      body2:
        "In the streaming route, the shell marker fires almost immediately and the data marker fires around the latency you set. The gap between the two shell numbers is the whole benefit: the same query, the same total time to complete, but the user is looking at a laid-out, interactive page for most of it instead of at nothing.",
      body3:
        "Notice what did not change: the completion times are close. A boundary does not make the query faster. It changes what the user is looking at while the query runs — which is chapter two's subject, from the other direction.",
    },
    placement: {
      title: "Push the boundary down, not up",
      body1:
        "A boundary drawn around the whole page satisfies the framework and helps nobody: every navigation replaces the entire view with one fallback. The smaller the waiting region, the more of the page arrives on click.",
      body2:
        "So the useful question is not \"where do I put a Suspense boundary\" but \"which parts of this page actually depend on per-request data?\" Usually fewer than you think. Layouts that await a session just to pick between two links. Page headers handed a fully loaded object to read one name off it. Tables that could render their own chrome, their own column headings and their own empty state without a single row. Those are the components that move.",
      body3:
        "The directive is the last five minutes of the job. The boundary placement is the job.",
    },
    shell: {
      title: "The shell is not a loading state",
      body: "A skeleton stands in for a page that has not arrived. A shell is the page itself — laid out, styled, interactive — with holes where per-request data goes. That distinction changes what belongs in it: navigation, headings, table columns, empty states, filter controls, anything true for every visitor. Treat the shell as a loading screen and you will under-fill it, and your reader still watches the layout assemble itself.",
    },
  },
  waterfall: {
    eyebrow: "Waterfall",
    title: "A boundary does not make your queries faster.",
    lede: "This is the mistake that survives the migration. The two routes below use identical Suspense boundaries — same fallback, same shape, same placement. Only the awaits moved, and the completion times are not close.",
    demo: {
      title: "Same boundary, different awaits",
      lede: "Two queries, one region, one boundary. On the left they are awaited one after the other; on the right they start together. This time, watch the completion number rather than the shell.",
      sequential: {
        title: "Awaited in sequence",
        caption:
          "The second query does not start until the first resolves, so the region costs the sum of both.",
      },
      parallel: {
        title: "Started together",
        caption:
          "Both queries are in flight before either is awaited, so the region costs the slower of the two.",
      },
    },
    code: {
      title: "The only difference",
      sequentialCaption: "Two round trips, back to back.",
      parallelCaption: "Same two queries, overlapping.",
    },
    reading: {
      title: "What you just measured",
      body1:
        "The shell timings are effectively identical, and they should be — the boundary is in the same place in both routes. What moved is the moment the data arrives, and with it the moment the page is actually usable.",
      body2:
        "This is why \"add Suspense boundaries\" is only half a migration. A boundary decides what the user looks at while a query runs; it has no opinion about how long the query takes. Push a waterfall behind a fallback and you have made the waiting prettier, not shorter — and because the page now paints immediately, the regression is easier to miss than it was before.",
    },
    independent: {
      title: "Boundaries resolve independently",
      lede: "One route, two regions, two boundaries, deliberately different query speeds. Neither region waits for the other.",
      paneTitle: "Two boundaries, one route",
      caption:
        "The stats row arrives first, the table follows. Each boundary swaps its own fallback as its own data resolves.",
      codeCaption:
        "Two boundaries, two regions. Nothing coordinates them.",
      body: "A single boundary around both regions keeps the fast result behind the same fallback until the slower query completes. Separate boundaries let each region stream as soon as its own data is ready. Choose boundaries around UI regions that can present a meaningful fallback independently.",
    },
    phases: {
      stats: "Stats streamed in",
      table: "Table streamed in",
    },
  },
  cache: {
    eyebrow: "Cache Components",
    title: "You mark data cached, not routes dynamic.",
    lede: "Cache Components makes data fetching dynamic by default and lets you opt individual functions into caching with the use cache directive. Enabling it also makes Partial Prerendering the App Router default, which is why experimental.ppr and experimental_ppr were removed.",
    inversion: {
      title: "The inversion",
      body1:
        "Under the old model you marked routes dynamic, and one per-request read anywhere decided for everything. Read a cookie in a layout to choose between \"Sign in\" and \"Dashboard\" and the marketing page underneath it became dynamic too. Most apps gave up and marked whole route groups force-dynamic.",
      body2:
        "Cache Components turns it around. Data fetching is dynamic by default; you opt individual functions into caching with use cache, and anything you leave unmarked stays dynamic. That is what lets a single route serve a prerendered shell and still show data belonging to one visitor.",
      body3:
        "The failure modes are not symmetrical, and that is the real argument. Forgetting to mark a route dynamic under the old model could serve one visitor another visitor's data — a correctness bug with a security shape. Forgetting to cache something under this one just makes it slower than it needed to be. You find the second in an audit. You find the first in an incident report.",
    },
    explorer: {
      title: "Three numbers, and the two things they decide",
      lede: "A cache profile is three durations. What the API surface does not tell you is that those three numbers also decide whether the content reaches the prerender and the App Shell at all. Pick a profile and read the verdict.",
      copy: {
        fields: {
          stale: {
            label: "stale",
            body: "How long the client reuses its copy before checking the server at all.",
          },
          revalidate: {
            label: "revalidate",
            body: "How often the server refreshes, still serving the old value meanwhile.",
          },
          expire: {
            label: "expire",
            body: "The point past which a stale value stops being served at all.",
          },
        },
        requestAt: "A request arrives after",
        client: "Client",
        server: "Server",
        outcomes: {
          clientCache:
            "Not contacted. The client is still inside its stale window.",
          serverCache: "Serves the cached value as-is.",
          staleRefresh:
            "Serves the cached value and regenerates it in the background.",
          blocking: "The entry has expired. This request waits for a fresh one.",
        },
        clientReuse: "Reuses its cached copy without contacting the server.",
        clientCheck: "Past its stale window, so it checks with the server.",
        verdict: {
          title: "Prerendering",
          prerendered: "Included in the prerender",
          notPrerendered: "Excluded from the prerender — a dynamic hole",
          inShell: "Carried in the App Shell",
          notInShell: "Not in the App Shell — streams in after a navigation",
          reasons: {
            revalidateZero:
              "A revalidate of 0 leaves no window in which the cached value may be served, so it is resolved at request time instead.",
            expireTooShort:
              "An expire under 5 minutes excludes this from prerenders; it becomes a dynamic hole resolved per request. Of the presets, only seconds crosses this line.",
            staleTooShort:
              "A stale under 30 seconds excludes this from prerenders, because a prefetch would expire before the user could click it.",
            staleUnderShellMinimum:
              "Prerendered, but a stale under 5 minutes keeps it out of the route's App Shell — so it streams in after a client navigation rather than arriving with it.",
            included:
              "Prerendered and carried in the App Shell, so a client navigation to this route shows it immediately.",
          },
        },
        customBadge: "custom",
      },
    },
    live: {
      title: "Invalidation, live",
      lede: "A real route with one cached value and one per-request value. The cached timestamp is written when the cache entry is created, so it only moves when something invalidates the tag. Press either button inside the frame and watch which value changes, and when.",
      paneTitle: "use cache with a tag",
      caption:
        "updateTag expires the entry immediately, so the render right after the action already shows a new timestamp. revalidateTag serves what is already cached and refreshes behind it, so the timestamp usually moves on the render after that one.",
    },
    code: {
      title: "The cached function",
      caption:
        "cacheLife and cacheTag both belong inside the cache scope, at the call site.",
    },
    serverless: {
      title: "Where this gets you in trouble",
      body: "The default use cache store is in memory, per instance. On a serverless platform an entry written by one instance may be invisible to the next, so two consecutive requests can show different cached timestamps. On platforms that support and configure a remote cache provider, use cache: remote can share the entry across instances. This page deliberately uses the standard directive so the deployment difference remains visible.",
    },
  },
  prefetch: {
    eyebrow: "Partial Prefetching",
    title: "One shell per route, shared by every link.",
    lede: "Before 16.3 a link either prefetched a loading.tsx shell or, with prefetch={true}, the whole page. Partial Prefetching extracts a reusable App Shell from any route and shares it across every link pointing there, so rendering a hundred links to one destination does that work once.",
    shells: {
      title: "Two shells, not one",
      body1:
        "A direct visit and a client navigation to the same route do not produce the same first UI, and this is the detail that makes the whole thing confusing to debug. A direct visit gets the static shell as HTML, usually from a CDN. A client navigation only re-renders below the layout the current and destination routes share — so a Suspense boundary sitting above that point cannot be used during the transition at all.",
      body2:
        "It is also why useSearchParams() behaves differently in the two cases. It suspends during server rendering, because search params are not known at build time, but resolves synchronously on a client navigation because the router already has them. The same component can render immediately on a soft navigation and sit behind a fallback on a page load.",
    },
    demo: {
      title: "What a link actually downloads",
      lede: "A small store with the product nav in the layout, so moving between products only re-renders the page below it. Pick a link mode, let the frame settle for a second, then click a product inside it.",
      copy: {
        modes: {
          auto: "<Link>",
          eager: "<Link prefetch>",
          off: "<Link prefetch={false}>",
        },
        modeHints: {
          auto: "Loads the destination's shared App Shell. The default under Partial Prefetching.",
          eager:
            "App Shell plus the per-link URL data, resolved through runtime prefetching.",
          off: "No prefetch at all. Everything is fetched after the click.",
        },
        requests: "fetch requests",
        transferred: "Transferred",
        clickHint: "Click a product",
        toProduct: "Click → product name",
        toInventory: "Click → inventory",
        devWarning:
          "Next.js disables prefetching in development. These measurements come from the running route, but they do not represent production prefetch behavior. Run pnpm build && pnpm start, or open the deployed site, for the production comparison.",
        reload: "Reload",
        openRoute: "Open this route directly",
        pending: "—",
      },
    },
    reading: {
      title: "What you just measured",
      body1:
        "With prefetching off, the click starts everything. With the default link, the shared App Shell is already on the client — the store header and the product nav never re-render — and the product name still is not there. It depends on params, and one App Shell is shared across every URL for that route, so URL data cannot be baked into it. Caching the lookup does not change that.",
      body2:
        "That is what prefetch={true} does now: it opts the link into runtime prefetching, which invokes the route with that link's params ahead of the click and resolves the cached content behind them. Inventory stays uncached on purpose and still costs a request. Partial Prefetching does not make per-request data free; it stops per-request data from holding everything else hostage.",
      body3:
        "The e2e suite in this repository asserts both halves of that, and it earned its place: the first draft of this chapter claimed the cached product name arrived with the default link. It does not, and a failing test is what said so rather than a careful reading.",
    },
  },
  migration: {
    eyebrow: "Migration",
    title: "Static, dynamic, and everything in between.",
    lede: "Static and dynamic rendering still exist and still mean what they always meant. What changed is that the choice is no longer made once, for an entire route.",
    modes: {
      title: "What actually changed",
      headers: { mode: "Mode", before: "Before 16", after: "With Cache Components" },
      rows: {
        static: {
          mode: "Static",
          before:
            "Generated at build. Fast everywhere, but the entire route had to be free of per-request data. One session read anywhere and the route lost its prerender.",
          after:
            "Still generated at build. The difference: a per-request read no longer disqualifies the route, only the region around it.",
        },
        dynamic: {
          mode: "Dynamic",
          before:
            "Rendered per request. Suspense boundaries could already stream independent regions, but the route as a whole could remain outside the prerender cache.",
          after:
            "Request-time data still renders per request, but it can be isolated to a region inside a Suspense boundary while the rest of the route comes from a prerendered shell.",
        },
        partial: {
          mode: "Partial",
          before:
            "Available experimentally in Next.js 15 through experimental.ppr and the experimental_ppr route segment config, but not the default App Router model.",
          after:
            "Part of the default rendering behavior when Cache Components is enabled. A prerendered shell serves immediately and request-time regions stream in through the same response; the experimental PPR configs are removed.",
        },
      },
    },
    report: {
      title: "This app's own build",
      lede: "Not an illustration. The table below is parsed straight out of the last `next build` in this repository, which is why /lab/blocking sits in it as a fully dynamic route next to partially prerendered siblings. One build, three rendering modes, no second application needed.",
      copy: {
        kinds: { static: "static", partial: "partial", dynamic: "dynamic" },
        kindHints: {
          static:
            "Prerendered at build and served without touching the server.",
          partial:
            "A static shell serves immediately while the dynamic regions stream in.",
          dynamic:
            "Server-rendered on demand. Nothing to prerender — in this repo, deliberately so.",
        },
        route: "Route",
        revalidate: "Revalidate",
        expire: "Expire",
        generated: "Generated from a real build at",
        regenerate: "pnpm report:build",
      },
    },
    gotchas: {
      title: "Five things that catch people out",
      lede: "None of these are obvious from the API surface, and most fail in a way that points you at the wrong file.",
      items: [
        {
          tag: "Cache Components",
          title: "next build stays green when the migration silently fails",
          body: "A route that blocks on runtime data is still a perfectly valid build. It just is not instant. The build output will not tell you.",
          fix: "Audit every route in a browser with the dev overlay on. Validation runs in next dev by default and never blocks the build.",
        },
        {
          tag: "Suspense",
          title:
            "searchParams outside a boundary only fails on client navigation",
          body: "A page that awaits searchParams at the top loads perfectly on a direct hit and reports nothing at all. Click a <Link> to it and the insight appears.",
          fix: "Auditing by visiting URLs will not find these. Grep for `await searchParams` instead.",
        },
        {
          tag: "Cache Components",
          title: "Suspense does not fix an unstable value",
          body: "Date.now(), new Date() and Math.random() error rather than degrading, because the same render would produce a different answer next time.",
          fix: "Fix by what the value is for: per-request needs await connection(), stable-for-a-while needs use cache with cacheLife, browser-only needs use client, telemetry needs performance.now().",
        },
        {
          tag: "Cache Components",
          title: "Never wrap a use cache function in React's cache()",
          body: "The build fails with \"Invalid value used as weak map key\", reported against generateMetadata rather than the loader that actually caused it.",
          fix: "The wrapper is redundant anyway: use cache dedupes across requests, not just within one.",
        },
        {
          tag: "Testing",
          title: "Your Playwright suite will break, and the failure will lie to you",
          body: "Cache Components enables React's <Activity>, so the previous route stays mounted and hidden. Every selector matches twice after a navigation. page.click() takes the first match, usually the invisible one, then waits for it to become visible until the test times out.",
          fix: "Scope selectors and containers with :visible. We hit this building chapter three — after a Server Action the DOM held three timestamp nodes where the interface showed two.",
        },
      ],
    },
    order: {
      title: "The order that works",
      body1:
        "Restructure first, flag second. Adding Suspense boundaries and moving data reads down the tree improves an app under the old rendering model on its own, before cacheComponents is enabled — and it is the part that takes real thought. Flipping the flag on an app whose boundaries are still wrong just converts a performance problem into a wall of validation insights.",
      body2:
        "Then partialPrefetching, which is a separate flag and a separate audit: every <Link prefetch={true}> needs a decision about what its destination should still prefetch. If the diff has to be smaller, export const prefetch = 'partial' adopts one route at a time with the global flag still off, and the remove-partial-prefetch codemod strips those exports once you flip it.",
    },
  },
  lab: {
    cached: {
      cachedLabel: "Cached value",
      cachedHint: "Written when the cache entry was created.",
      liveLabel: "Per-request value",
      liveHint: "Read after await connection(), so it is fresh every request.",
      profile: "profile",
      tag: "tag",
      updateHint:
        "Expires it now. This render already shows the new value.",
      revalidateHint:
        "Serves what is cached and refreshes behind it.",
    },
    store: {
      pickOne: "Pick a product above.",
      inStock: "{count} in stock",
      checking: "Checking availability…",
    },
  },
  common: {
    run: "Run",
    runBoth: "Run both",
    reset: "Reset",
    running: "Running…",
    latency: "Added latency",
    openRoute: "Open this route directly",
    shellPainted: "Shell painted",
    dataStreamed: "Data streamed in",
    complete: "Complete",
    waiting: "Press Run to render this route.",
    honesty:
      "Both panes render for real on every run, at the same time, against the same server. The latency is added on the server so the gap is visible at normal speed; the streaming itself is not simulated. Open a demo route directly to check it yourself.",
  },
};

export type Dictionary = typeof en;
