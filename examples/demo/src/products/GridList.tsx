import React, { FC } from 'react';
import MuiGridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { Link } from 'react-router-dom';
import { NumberField } from 'react-admin';
import { linkToRecord } from 'ra-core';
import { ListControllerProps } from 'ra-core/esm/controller/useListController';

import { Product } from '../types';

interface Props extends ListControllerProps<Product> {
    width: Breakpoint;
}

interface LoadedGridListProps extends Omit<Props, 'loaded'> {}

interface LoadingGridListProps extends Omit<Props, 'loaded'> {
    nbItems?: number;
}

const useStyles = makeStyles(theme => ({
    root: {
        margin: '-2px',
    },
    gridList: {
        width: '100%',
        margin: 0,
    },
    tileBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
    },
    placeholder: {
        backgroundColor: theme.palette.grey[300],
        height: '100%',
    },
    price: {
        display: 'inline',
        fontSize: '1em',
    },
    link: {
        color: '#fff',
    },
}));

const getColsForWidth = (width: Breakpoint) => {
    if (width === 'xs') return 2;
    if (width === 'sm') return 3;
    if (width === 'md') return 4;
    if (width === 'lg') return 5;
    return 6;
};

const times = (nbChildren: number, fn: (key: number) => void) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList: FC<LoadingGridListProps> = ({ width, nbItems = 10 }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <MuiGridList
                cellHeight={180}
                cols={getColsForWidth(width)}
                className={classes.gridList}
            >
                {' '}
                {times(nbItems, key => (
                    <GridListTile key={key}>
                        <div className={classes.placeholder} />
                    </GridListTile>
                ))}
            </MuiGridList>
        </div>
    );
};

const LoadedGridList: FC<LoadedGridListProps> = ({
    ids,
    data,
    basePath,
    width,
}) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <MuiGridList
                cellHeight={180}
                cols={getColsForWidth(width)}
                className={classes.gridList}
            >
                {ids.map(id => (
                    <GridListTile
                        // @ts-ignore
                        component={Link}
                        key={id}
                        to={linkToRecord(basePath, data[id].id)}
                    >
                        <img src={data[id].thumbnail} alt="" />
                        <GridListTileBar
                            className={classes.tileBar}
                            title={data[id].reference}
                            subtitle={
                                <span>
                                    {data[id].width}x{data[id].height},{' '}
                                    <NumberField
                                        className={classes.price}
                                        source="price"
                                        record={data[id]}
                                        color="inherit"
                                        options={{
                                            style: 'currency',
                                            currency: 'USD',
                                        }}
                                    />
                                </span>
                            }
                        />
                    </GridListTile>
                ))}
            </MuiGridList>
        </div>
    );
};

const GridList: FC<Props> = ({ loaded, ...props }) =>
    loaded ? <LoadedGridList {...props} /> : <LoadingGridList {...props} />;

export default withWidth()(GridList);
