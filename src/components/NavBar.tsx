import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { store } from '../store'
import { isDocumentEditable, publishMode } from '../util'
import { isTutorial, simplifyPath } from '../selectors'
import HomeLink from './HomeLink'
import { State } from '../util/initialState'
import ContextBreadcrumbs from './ContextBreadcrumbs'
import QuickAddButton from './QuickAddButton'
import FeedbackButton from './FeedbackButton'
import { Path, SimplePath } from '../types'

// eslint-disable-next-line jsdoc/require-jsdoc
const mapStateToProps = (state: State) => {
  const { cursor, showBreadcrumbs } = state
  const breadcrumbPath = (cursor ? cursor.slice(publishMode() ? 1 : 0, cursor.length - 1) : []) as Path
  const breadcrumbSimplePath = simplifyPath(state, breadcrumbPath)
  return {
    cursor,
    showBreadcrumbs,
    breadcrumbSimplePath,
  }
}

/** A navigation bar that contains a link to home and breadcrumbs. */
const NavBar = ({
  breadcrumbSimplePath,
  cursor,
  position,
  showBreadcrumbs,
}: {
  breadcrumbSimplePath: SimplePath
  cursor: Path | null
  position: string
  showBreadcrumbs: boolean
}) => {
  const isTutorialOn = isTutorial(store.getState())

  return (
    <div
      className={classNames({
        nav: true,
        ['nav-' + position]: true,
        'nav-fill': cursor && cursor.length > 1,
      })}
    >
      <div className='nav-inset'>
        <div className='nav-container' style={{ justifyContent: 'flex-end' }}>
          {!isTutorialOn && (
            <>
              {isDocumentEditable() || (cursor && cursor.length > 2) ? <HomeLink /> : null}
              <CSSTransition in={showBreadcrumbs} timeout={200} classNames='fade' unmountOnExit>
                <div style={{ flexGrow: 1 }}>
                  <ContextBreadcrumbs
                    simplePath={breadcrumbSimplePath}
                    classNamesObject={{ 'nav-breadcrumbs': true }}
                  />
                </div>
              </CSSTransition>

              <div className='nav-right-button-group'>
                <FeedbackButton />
                <QuickAddButton />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(NavBar)
