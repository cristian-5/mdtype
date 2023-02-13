const e = function(e) {
	function r(e, r, n, _u, a) {
		const o = e[r];
		return "_" === o.markup && (o.tag = "u"), a.renderToken(e, r, n);
	}
	e.renderer.rules.em_open = r, e.renderer.rules.em_close = r;
};
		
export { e as default };
