const links = [ 
    { "name": "First song I ever learnt on the guitar!", "url": "https://open.spotify.com/track/0ZAiqymvbQUZAh9y6ZT3Rm?si=gF7NTtkzTSOI18WuE1CnXQ" },
    { "name": "Is this how working at cloudfront is like?", "url": "https://xkcd.com/386/" },
    { "name": "Possibly the best fried chicken place in Vancouver.", "url": "https://www.dlchickenshack.ca/" },
 ]

/**
 * Generic ElementTransformer for easier inline editing.
 * @param  {Async function} elementModifier function to modify HTML elements.
 */
class ElementTransformer {
    constructor(elementModifier) {
        this.element = elementModifier 
    }
    async element(htmlElement) { this.element(htmlElement) } 
}

 /**
   * Handles a FETCH request to the worker.
   * @param  {Request} request Request Promise from the FETCH event to the worker.
   * @return {Response} Promise with either JSON or HTML data.
   */
const requestHandler = async(request) => {
    if (request.url.endsWith('/links')) 
        return new Response(JSON.stringify(links), { headers: { "content-type": "application/json;charset=UTF-8" } })
    
    const template = await fetch('https://static-links-page.signalnerve.workers.dev/static/html', { headers: { "content-type": "text/html;charset=UTF-8" } })

    return new HTMLRewriter()
            .on("div#profile", new ElementTransformer(async(element) => element.removeAttribute('style')))
            .on("h1#name", new ElementTransformer(async(element) => element.setInnerContent("r614")))
            .on("img#avatar", new ElementTransformer(async(element) => element.setAttribute("src", "https://avatars0.githubusercontent.com/u/35357371?s=460&u=0a103e2af7940e08a8a4ac0f06bf6e4bd4ca4a55&v=4")))
            .on("title", new ElementTransformer(async(element) => element.setInnerContent("Roshan Pawar")))
            .on("body", new ElementTransformer(async(element) => element.setAttribute("class", "bg-purple-300")))
            .on("div#social", new ElementTransformer(async(element) => {
                    element.removeAttribute('style')
                    element.append("<a href=\"https://www.linkedin.com/in/r614\"><img src=\"https://www.flaticon.com/svg/static/icons/svg/174/174857.svg\"></a>", { html: true })
                    element.append("<a href=\"https://www.github.com/r614\"><img src=\"https://www.flaticon.com/svg/static/icons/svg/37/37318.svg\"></a>", { html: true })
                    element.append("<a href=\"https://r614.dev\"><img src=\"https://www.flaticon.com/svg/static/icons/svg/3601/3601106.svg\"></a>", { html: true })

                }))
            .on("div#links", new ElementTransformer(async(element) => { 
                    links.forEach(linkObject => element.append(`<a href="${linkObject.url}">${linkObject.name}</a>`, { html: true }))
                }))
            .transform(template);
}

addEventListener('fetch', event => event.respondWith(requestHandler(event.request)))
  