import React, {useEffect} from "react";
import {useTag} from '../../context/Tag'
import {makeStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ConfirmDialog from "../../components/ConfirmDialog";
import CircularProgress from '@material-ui/core/CircularProgress';
import TagForm from "./components/Form";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    actionBtn: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    cursor: {
        cursor: 'pointer'
    },
    wrapper: {
        flexWrap: 'nowrap'
    },
    leftCol: {
        width: '480px'
    },
    rightCol: {
        flexGrow: 1
    },
}));

const TagList = ({match, history}) => {
    const {tags, loading, listTags, getTag, newTag, deleteTag} = useTag();
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const classes = useStyles();
    const tagId = match.params.tagId;

    useEffect(() => {
        if (tagId) {
            async function fetchData() {
                getTag(tagId)
            }

            fetchData();
            return
        }

        newTag();

        async function fetchData() {
            await listTags()
        }

        fetchData();
        // eslint-disable-next-line
    }, [tagId]);

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Tags
            </Typography>
            <Grid container spacing={4} className={classes.wrapper}>
                <Grid item className={classes.leftCol}>
                    <TagForm match={match} history={history}/>
                </Grid>
                <Grid item className={classes.rightCol}>
                    {!tagId && (
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Slug</TableCell>
                                        <TableCell align="right">Count</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading && (
                                        <TableRow>
                                            <TableCell colSpan="100%" align="center">
                                                <CircularProgress size={24} className={classes.progress}/>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {!loading && (
                                        <>
                                            {(!tags || !tags.length) && (
                                                <TableRow>
                                                    <TableCell colSpan="100%" align="center">
                                                        No tags found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {tags && tags.length > 0 && tags.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        <Box mb={0.5} fontWeight="fontWeightBold">
                                                            <Link to={`/tags/${row.id}`}>{row.name}</Link>
                                                        </Box>
                                                        <Box className={`${classes.actions} text-grey`}>
                                                            <Link to={`/tags/${row.id}`}>Edit</Link>
                                                            <Box display="inline" px={0.65}>|</Box>
                                                            <Link to="#" onClick={() => setConfirmDelete(row.id)}
                                                                  className="pointer text-danger">Delete</Link>
                                                            <Box display="inline" px={0.65}>|</Box>
                                                            <Link to={`/tags/${row.id}`} target="_blank"
                                                                  rel="noopener noreferrer">View</Link>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{row.description}</TableCell>
                                                    <TableCell>{row.slug}</TableCell>
                                                    <TableCell align="right">0</TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)}
                           title="Are you sure you want to delete this tag?"
                           content="The tag will be deleted and removed from all posts."
                           action="Delete"
                           callback={() => deleteTag(confirmDelete)}
            ></ConfirmDialog>
        </>
    );
};

export default TagList;