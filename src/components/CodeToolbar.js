// @flow

import React from 'react'
import {observer} from 'mobx-react'
import {jss, layout, colors, fonts, shadows} from '../styles'
import {SVG, Markdown, ToolbarButton, Button, MessageBox, ScoreStars} from '.'
import {levelStore, programStore} from '../stores'

export type Props = {}

@observer
export default class CodeToolbar extends React.Component<*, Props, *> {

	props: Props

	async confirmAndReset() {
		const confirmed = await MessageBox.show({
			title:   "Reset level",
			message: "Are you sure you want to reset to the original level code?",
			buttons: [
				{label: "Yes, I'm sure", result: true},
				{label: "No, keep this", result: false}
			]
		})

		if (confirmed) {
			programStore.resetCode()
		}
	}

	render() {
		return (
			<div className={$.toolbar}>
				<SVG name='logo' className={$.logo}/>
				<div className={$.main}>
					{this.renderLevelName()}
					{this.renderLevelSelector()}
				</div>
				{this.renderResetButton()}
			</div>
		)
	}

	renderLevelName() {
		const {level} = programStore

		return (
			<div className={$.levelName}>
				{level.name}
			</div>
		)
	}

	renderLevelSelector() {
		return (
			<div className={$.levelSelector}>
				{levelStore.levels.map(level => this.renderLevelButton(level))}
			</div>
		)
	}

	renderLevelButton(level: Level) {
		const score = levelStore.levelScores.get(level.id)

		return (
			<Button
				key={level.id}
				label={level.id.toString()}
				small
				color={programStore.isActiveLevel(level) ? colors.green : colors.purple.lighten(0.2)}
				disabled={!levelStore.isLevelSelectable(level)}
				onTap={this.onLevelTap.bind(this, level)}
			>
				{score && <ScoreStars score={score} starSize={10} padding={4} animated={false}/>}
			</Button>
		)
	}

	renderResetButton() {
		return (
			<ToolbarButton
				className={$.resetButton}
				icon='reset'
				label="RESET"
				onTap={this.onResetTap}
			/>
		)
	}

	onLevelTap = (level: Level) => {
		levelStore.goTo(level.id)
	}

	onResetTap = () => {
		this.confirmAndReset()
	}

}

const $ = jss({
	toolbar: {
		position:  'relative',
		minHeight: 96,

		...layout.flex.row,
		alignItems:     'flex-start',
		justifyContent: 'space-between',
		padding:        layout.padding.s,

		borderBottom: [1, 'solid', colors.white.alpha(0.2)],
		boxShadow:    shadows.toolbar,

		background: colors.bg.toolbar,
		color:      colors.fg.inverted
	},

	logo: {
		width:  64,
		height: 64,
		fill:   colors.green
	},

	main: {
		flex:  [1, 0, 0],

		...layout.flex.column,
		justifyContent: 'space-between',
		marginLeft:     layout.padding.m
	},

	levelName: {
		font:  fonts.large
	},

	levelSelector: {
		...layout.row(layout.padding.xs),
		flexWrap: 'wrap',

		paddingTop:   layout.padding.xs,
		marginBottom: layout.padding.xs - layout.padding.s,

		'& > *': {
			marginBottom: layout.padding.xs
		}
	},

	resetButton: {
		alignSelf: 'center'
	}
})