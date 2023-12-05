export default async function delay() {
    await new Promise(res => setTimeout(res, 2000));
}