declare module "*.json" {
	const value: import("./types").Dictionary;
	export default value;
}
