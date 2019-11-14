/**
 * This function should use axios to make a GET request to the following url:
 *   https://comp426fa19.cs.unc.edu/a08/heroes
 *
 * The axios request should be "await"ed, and once the response is available,
 *   the body of the HTTP response (which is in JSON format) should be returned
 *   as a JavaScript Object.
 *
 * @returns  {Object}  The body of the HTTP response.
 */
export async function fn1() {
    const response = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a08/heroes',
    });
    return response.data;
    // might need to wait for resolve
};