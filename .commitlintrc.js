module.exports = {
	ignores: [(commit) => commit.includes('init')],
	extends: ['@commitlint/config-conventional'],
	rules: {
		// 信息以空格开头
		'body-leading-blank': [2, 'always'],
		'footer-leading-blank': [2, 'always'],
		// 信息最大长度
		'header-max-length': [2, 'always', 108],
		// 信息不能未空
		'subject-empty': [2, 'never'],
		// 信息类型不能未空
		'type-empty': [2, 'never'],
		// 提交信息的类型 下文有介绍
		'type-enum': [
			2,
			'always',
			[
				'feat', // ✨ 新功能
				'fix', // 🐛 修复bug
				'docs', // 📝 文档变更
				'style', // 💄 代码格式（不影响功能）
				'refactor', // ♻️ 重构（非bug/非功能）
				'perf', // ⚡️ 性能优化
				'test', // ✅ 测试用例
				'build', // 👷 构建/依赖变更
				'ci', // 🔧 CI/CD配置
				'chore', // 🎨 其他（构建/工具/脚本）
				'revert' // ⏪ 回滚提交
			]
		]
	}
};
