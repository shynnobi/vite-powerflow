/**
 * Simple logger utility that handles logging based on environment
 * Can be easily extended to support more sophisticated logging systems
 */
export const logger = {
	/**
	 * Log warning messages (only in development)
	 * for warnings/cautions
	 */
	warn: (message: string, ...args: unknown[]) => {
		if (process.env.NODE_ENV === 'development') {
			console.warn(`⚠️ ${message}`, ...args);
		}
	},

	/**
	 * Log error messages (in all environments)
	 * for errors/failures
	 */
	error: (message: string, ...args: unknown[]) => {
		console.error(`🔴 ${message}`, ...args);
	},

	/**
	 * Log info messages (only in development)
	 * for information/details
	 */
	info: (message: string, ...args: unknown[]) => {
		if (process.env.NODE_ENV === 'development') {
			console.info(`ℹ️ ${message}`, ...args);
		}
	},
};
