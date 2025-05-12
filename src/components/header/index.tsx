import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import type { HeaderProps, NavigationProps } from './types';
import PrevButton from './prev-button';
import NextButton from './next-button';
import Selectors from './selectors';
import { isEqual } from 'lodash';
import { useCalendarContext } from '../../calendar-context';
import dayjs from 'dayjs';

const createDefaultStyles = (isRTL: boolean) =>
  StyleSheet.create({
    headerContainer: {
      paddingVertical: 3,
    },
    container: {
      padding: 5,
      gap: 20,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navigation: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
  });

const NavigationButtons = ({
  styles,
  classNames,
  isRTL,
  hidePrevSelector = false,
  hideNextSelector = false,
}: NavigationProps) => {
  const style = useMemo(() => createDefaultStyles(isRTL), [isRTL]);

  return (
    <View style={style.navigation}>
      {!hidePrevSelector && (
        <PrevButton
          style={styles?.button_prev}
          imageStyle={styles?.button_prev_image}
          className={classNames?.button_prev}
          imageClassName={classNames?.button_prev_image}
        />
      )}
      {!hideNextSelector && (
        <NextButton
          style={styles?.button_next}
          imageStyle={styles?.button_next_image}
          className={classNames?.button_next}
          imageClassName={classNames?.button_next_image}
        />
      )}
    </View>
  );
};

const Header = ({
  navigationPosition = 'around',
  styles = {},
  classNames = {},
  isRTL,
}: HeaderProps) => {
  const style = useMemo(() => createDefaultStyles(isRTL), [isRTL]);
  const { calendarView, currentActiveDate, minDate, maxDate } =
    useCalendarContext();

  const monthNavigation = useMemo(() => {
    const minDateDetails = minDate ? dayjs(minDate) : undefined;
    const maxDateDetails = maxDate ? dayjs(maxDate) : undefined;
    const currentActiveDateDetails = currentActiveDate
      ? dayjs(currentActiveDate)
      : undefined;
    const canGoPrev =
      !minDateDetails ||
      calendarView !== 'day' ||
      (currentActiveDateDetails &&
        currentActiveDateDetails.isAfter(minDateDetails, 'month'));

    const canGoNext =
      !maxDateDetails ||
      calendarView !== 'day' ||
      (currentActiveDateDetails &&
        currentActiveDateDetails.isBefore(maxDateDetails, 'month'));
    return {
      prev: !!canGoPrev,
      next: !!canGoNext,
    };
  }, [calendarView, currentActiveDate, maxDate, minDate]);

  return (
    <View
      style={[style.headerContainer, styles?.header]}
      className={classNames?.header}
    >
      <View style={style.container}>
        {navigationPosition === 'left' ? (
          <>
            <NavigationButtons
              styles={styles}
              classNames={classNames}
              isRTL={isRTL}
              hidePrevSelector={!monthNavigation.prev}
              hideNextSelector={!monthNavigation.next}
            />
            <Selectors position="left" />
          </>
        ) : navigationPosition === 'right' ? (
          <>
            <Selectors position="right" />
            <NavigationButtons
              styles={styles}
              classNames={classNames}
              isRTL={isRTL}
              hidePrevSelector={!monthNavigation.prev}
              hideNextSelector={!monthNavigation.next}
            />
          </>
        ) : (
          <>
            {monthNavigation.prev && (
              <PrevButton
                style={styles?.button_prev}
                imageStyle={styles?.button_prev_image}
                className={classNames?.button_prev}
                imageClassName={classNames?.button_prev_image}
              />
            )}
            <Selectors position="around" />
            {monthNavigation.next && (
              <NextButton
                style={styles?.button_next}
                imageStyle={styles?.button_next_image}
                className={classNames?.button_next}
                imageClassName={classNames?.button_next_image}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

const customComparator = (
  prev: Readonly<HeaderProps>,
  next: Readonly<HeaderProps>
) => {
  const areEqual =
    prev.PrevIcon === next.PrevIcon &&
    prev.NextIcon === next.NextIcon &&
    prev.navigationPosition === next.navigationPosition &&
    prev.isRTL === next.isRTL &&
    isEqual(prev.styles, next.styles) &&
    isEqual(prev.classNames, next.classNames);

  return areEqual;
};

export default memo(Header, customComparator);
