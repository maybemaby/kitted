/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		'@csstools/postcss-global-data': {
			files: ['node_modules/open-props/media.min.css']
		},
		'postcss-flexbugs-fixes': {},
		'postcss-preset-env': {
			autoprefixer: {
				flexbox: 'no-2009'
			},
			stage: 3,
			features: {
				'custom-properties': false,
				'custom-media-queries': {}
			}
		}
	}
};

module.exports = config;
